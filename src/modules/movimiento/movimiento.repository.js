import { pool } from "../../db.js";

export async function fetchTipoMovimientos() {
  const result = await pool.query(
    "SELECT * FROM TIPOMOV WHERE ESTADO_TIPOMOV = 'A'"
  );
  return result.rows;
}

export async function fetchMovimientos() {
  const result = await pool.query("SELECT * FROM MOVPRODUCTO");
  return result.rows;
}

export async function insertMovimiento(data) {
  const {
    ID_TIPOMOV_MOVIMIENTO,
    ID_PRODUCTO_MOVIMIENTO,
    CANTIDAD_MOVIMIENTO,
    ID_SEDE_MOVIMIENTO,
    ID_SEDEDESTINO_MOVIMIENTO = null,
    ID_CLIENTE_MOVIMIENTO = null,
    ID_PROVEEDOR_MOVIMIENTO = null,
    FECHA_MOVIMIENTO = new Date().toISOString().split("T")[0],
    ESTADO_MOVIMIENTO = "A",
    STOCK_MINIMO = null,
    STOCK_MAXIMO = null,
  } = data;

  if (
    !ID_TIPOMOV_MOVIMIENTO ||
    !ID_PRODUCTO_MOVIMIENTO ||
    !CANTIDAD_MOVIMIENTO ||
    !ID_SEDE_MOVIMIENTO
  ) {
    throw { status: 400, message: "Campos obligatorios faltantes" };
  }

  if (ID_SEDE_MOVIMIENTO === ID_SEDEDESTINO_MOVIMIENTO) {
    throw {
      status: 400,
      message: "La sede origen y destino no pueden ser iguales",
    };
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Registrar movimiento
    const result = await client.query(
      `INSERT INTO MOVPRODUCTO (
        ID_TIPOMOV_MOVIMIENTO, ID_PRODUCTO_MOVIMIENTO, CANTIDAD_MOVIMIENTO, 
        FECHA_MOVIMIENTO, ESTADO_MOVIMIENTO, ID_SEDE_MOVIMIENTO, ID_SEDEDESTINO_MOVIMIENTO, 
        ID_CLIENTE_MOVIMIENTO, ID_PROVEEDOR_MOVIMIENTO
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [
        ID_TIPOMOV_MOVIMIENTO,
        ID_PRODUCTO_MOVIMIENTO,
        CANTIDAD_MOVIMIENTO,
        FECHA_MOVIMIENTO,
        ESTADO_MOVIMIENTO,
        ID_SEDE_MOVIMIENTO,
        ID_SEDEDESTINO_MOVIMIENTO,
        ID_CLIENTE_MOVIMIENTO,
        ID_PROVEEDOR_MOVIMIENTO,
      ]
    );

    // ------------------------------
    // Manejo inventario según tipo
    // ------------------------------

    // 1. Entrada por Ajuste → UPSERT suma en inventario local
    if (ID_TIPOMOV_MOVIMIENTO === 1) {
      await client.query(
        `INSERT INTO INVENTARIOLOCAL 
          (ID_PRODUCTO_INVENTARIOLOCAL, ID_SEDE_INVENTARIOLOCAL, EXISTENCIA_INVENTARIOLOCAL, STOCKMINIMO_INVENTARIOLOCAL, STOCKMAXIMO_INVENTARIOLOCAL)
         VALUES ($1,$2,$3,COALESCE($4,0),COALESCE($5,0))
         ON CONFLICT (ID_PRODUCTO_INVENTARIOLOCAL, ID_SEDE_INVENTARIOLOCAL)
         DO UPDATE SET EXISTENCIA_INVENTARIOLOCAL = INVENTARIOLOCAL.EXISTENCIA_INVENTARIOLOCAL + EXCLUDED.EXISTENCIA_INVENTARIOLOCAL`,
        [
          ID_PRODUCTO_MOVIMIENTO,
          ID_SEDE_MOVIMIENTO,
          CANTIDAD_MOVIMIENTO,
          STOCK_MINIMO,
          STOCK_MAXIMO,
        ]
      );
    }

    // 2. Salida por Ajuste, 3. Venta Crédito, 4. Venta Contado → UPSERT resta
    if ([2, 3, 4].includes(ID_TIPOMOV_MOVIMIENTO)) {
      await client.query(
        `UPDATE INVENTARIOLOCAL 
         SET EXISTENCIA_INVENTARIOLOCAL = EXISTENCIA_INVENTARIOLOCAL - $1
         WHERE ID_PRODUCTO_INVENTARIOLOCAL = $2 AND ID_SEDE_INVENTARIOLOCAL = $3`,
        [CANTIDAD_MOVIMIENTO, ID_PRODUCTO_MOVIMIENTO, ID_SEDE_MOVIMIENTO]
      );
    }

    // 5. Cambio de sede → resta en origen y UPSERT en destino
    if (ID_TIPOMOV_MOVIMIENTO === 5) {
      // origen
      await client.query(
        `UPDATE INVENTARIOLOCAL 
         SET EXISTENCIA_INVENTARIOLOCAL = EXISTENCIA_INVENTARIOLOCAL - $1
         WHERE ID_PRODUCTO_INVENTARIOLOCAL = $2 AND ID_SEDE_INVENTARIOLOCAL = $3`,
        [CANTIDAD_MOVIMIENTO, ID_PRODUCTO_MOVIMIENTO, ID_SEDE_MOVIMIENTO]
      );

      // destino
      await client.query(
        `INSERT INTO INVENTARIOLOCAL 
          (ID_PRODUCTO_INVENTARIOLOCAL, ID_SEDE_INVENTARIOLOCAL, EXISTENCIA_INVENTARIOLOCAL, STOCKMINIMO_INVENTARIOLOCAL, STOCKMAXIMO_INVENTARIOLOCAL)
         VALUES ($1,$2,$3,COALESCE($4,0),COALESCE($5,0))
         ON CONFLICT (ID_PRODUCTO_INVENTARIOLOCAL, ID_SEDE_INVENTARIOLOCAL)
         DO UPDATE SET EXISTENCIA_INVENTARIOLOCAL = INVENTARIOLOCAL.EXISTENCIA_INVENTARIOLOCAL + EXCLUDED.EXISTENCIA_INVENTARIOLOCAL`,
        [
          ID_PRODUCTO_MOVIMIENTO,
          ID_SEDEDESTINO_MOVIMIENTO,
          CANTIDAD_MOVIMIENTO,
          STOCK_MINIMO,
          STOCK_MAXIMO,
        ]
      );
    }

    // 6. Ingreso por Garantía → si existe en estado G se descuenta, si no existe se suma al inventario normal
    if (ID_TIPOMOV_MOVIMIENTO === 6) {
      const { rows } = await client.query(
        `SELECT CANTIDAD FROM INVENTARIOLOCAL_ESTADO 
     WHERE ID_PRODUCTO = $1 AND ID_SEDE = $2 AND ESTADO = 'G'`,
        [ID_PRODUCTO_MOVIMIENTO, ID_SEDE_MOVIMIENTO]
      );

      if (rows.length > 0) {
        const nuevaCantidad = rows[0].cantidad - CANTIDAD_MOVIMIENTO;
        if (nuevaCantidad > 0) {
          await client.query(
            `UPDATE INVENTARIOLOCAL_ESTADO 
         SET CANTIDAD = $1 
         WHERE ID_PRODUCTO = $2 AND ID_SEDE = $3 AND ESTADO = 'G'`,
            [nuevaCantidad, ID_PRODUCTO_MOVIMIENTO, ID_SEDE_MOVIMIENTO]
          );
        } else {
          await client.query(
            `DELETE FROM INVENTARIOLOCAL_ESTADO 
         WHERE ID_PRODUCTO = $1 AND ID_SEDE = $2 AND ESTADO = 'G'`,
            [ID_PRODUCTO_MOVIMIENTO, ID_SEDE_MOVIMIENTO]
          );
        }
      }

      // Siempre vuelve al inventario normal
      await client.query(
        `INSERT INTO INVENTARIOLOCAL 
      (ID_PRODUCTO_INVENTARIOLOCAL, ID_SEDE_INVENTARIOLOCAL, EXISTENCIA_INVENTARIOLOCAL, STOCKMINIMO_INVENTARIOLOCAL, STOCKMAXIMO_INVENTARIOLOCAL)
     VALUES ($1,$2,$3,COALESCE($4,0),COALESCE($5,0))
     ON CONFLICT (ID_PRODUCTO_INVENTARIOLOCAL, ID_SEDE_INVENTARIOLOCAL)
     DO UPDATE SET EXISTENCIA_INVENTARIOLOCAL = INVENTARIOLOCAL.EXISTENCIA_INVENTARIOLOCAL + EXCLUDED.EXISTENCIA_INVENTARIOLOCAL`,
        [
          ID_PRODUCTO_MOVIMIENTO,
          ID_SEDE_MOVIMIENTO,
          CANTIDAD_MOVIMIENTO,
          STOCK_MINIMO,
          STOCK_MAXIMO,
        ]
      );
    }

    // 7. Salida por Garantía → resta en inventario local + suma en estado G
    if (ID_TIPOMOV_MOVIMIENTO === 7) {
      await client.query(
        `UPDATE INVENTARIOLOCAL 
         SET EXISTENCIA_INVENTARIOLOCAL = EXISTENCIA_INVENTARIOLOCAL - $1
         WHERE ID_PRODUCTO_INVENTARIOLOCAL = $2 AND ID_SEDE_INVENTARIOLOCAL = $3`,
        [CANTIDAD_MOVIMIENTO, ID_PRODUCTO_MOVIMIENTO, ID_SEDE_MOVIMIENTO]
      );

      await client.query(
        `INSERT INTO INVENTARIOLOCAL_ESTADO (ID_PRODUCTO, ID_SEDE, ESTADO, CANTIDAD)
         VALUES ($1,$2,'G',$3)
         ON CONFLICT (ID_PRODUCTO, ID_SEDE, ESTADO)
         DO UPDATE SET CANTIDAD = INVENTARIOLOCAL_ESTADO.CANTIDAD + EXCLUDED.CANTIDAD`,
        [ID_PRODUCTO_MOVIMIENTO, ID_SEDE_MOVIMIENTO, CANTIDAD_MOVIMIENTO]
      );
    }

    // 8. Ingreso por Reparación → si existe en estado R se descuenta, si no existe se suma al inventario normal
    if (ID_TIPOMOV_MOVIMIENTO === 8) {
      const { rows } = await client.query(
        `SELECT CANTIDAD FROM INVENTARIOLOCAL_ESTADO 
     WHERE ID_PRODUCTO = $1 AND ID_SEDE = $2 AND ESTADO = 'R'`,
        [ID_PRODUCTO_MOVIMIENTO, ID_SEDE_MOVIMIENTO]
      );

      if (rows.length > 0) {
        const nuevaCantidad = rows[0].cantidad - CANTIDAD_MOVIMIENTO;
        if (nuevaCantidad > 0) {
          await client.query(
            `UPDATE INVENTARIOLOCAL_ESTADO 
         SET CANTIDAD = $1 
         WHERE ID_PRODUCTO = $2 AND ID_SEDE = $3 AND ESTADO = 'R'`,
            [nuevaCantidad, ID_PRODUCTO_MOVIMIENTO, ID_SEDE_MOVIMIENTO]
          );
        } else {
          await client.query(
            `DELETE FROM INVENTARIOLOCAL_ESTADO 
         WHERE ID_PRODUCTO = $1 AND ID_SEDE = $2 AND ESTADO = 'R'`,
            [ID_PRODUCTO_MOVIMIENTO, ID_SEDE_MOVIMIENTO]
          );
        }
      }

      // Siempre vuelve al inventario normal
      await client.query(
        `INSERT INTO INVENTARIOLOCAL 
      (ID_PRODUCTO_INVENTARIOLOCAL, ID_SEDE_INVENTARIOLOCAL, EXISTENCIA_INVENTARIOLOCAL, STOCKMINIMO_INVENTARIOLOCAL, STOCKMAXIMO_INVENTARIOLOCAL)
     VALUES ($1,$2,$3,COALESCE($4,0),COALESCE($5,0))
     ON CONFLICT (ID_PRODUCTO_INVENTARIOLOCAL, ID_SEDE_INVENTARIOLOCAL)
     DO UPDATE SET EXISTENCIA_INVENTARIOLOCAL = INVENTARIOLOCAL.EXISTENCIA_INVENTARIOLOCAL + EXCLUDED.EXISTENCIA_INVENTARIOLOCAL`,
        [
          ID_PRODUCTO_MOVIMIENTO,
          ID_SEDE_MOVIMIENTO,
          CANTIDAD_MOVIMIENTO,
          STOCK_MINIMO,
          STOCK_MAXIMO,
        ]
      );
    }

    // 9. Salida por Reparación → resta en inventario local + suma en estado R
    if (ID_TIPOMOV_MOVIMIENTO === 9) {
      await client.query(
        `UPDATE INVENTARIOLOCAL 
         SET EXISTENCIA_INVENTARIOLOCAL = EXISTENCIA_INVENTARIOLOCAL - $1
         WHERE ID_PRODUCTO_INVENTARIOLOCAL = $2 AND ID_SEDE_INVENTARIOLOCAL = $3`,
        [CANTIDAD_MOVIMIENTO, ID_PRODUCTO_MOVIMIENTO, ID_SEDE_MOVIMIENTO]
      );

      await client.query(
        `INSERT INTO INVENTARIOLOCAL_ESTADO (ID_PRODUCTO, ID_SEDE, ESTADO, CANTIDAD)
         VALUES ($1,$2,'R',$3)
         ON CONFLICT (ID_PRODUCTO, ID_SEDE, ESTADO)
         DO UPDATE SET CANTIDAD = INVENTARIOLOCAL_ESTADO.CANTIDAD + EXCLUDED.CANTIDAD`,
        [ID_PRODUCTO_MOVIMIENTO, ID_SEDE_MOVIMIENTO, CANTIDAD_MOVIMIENTO]
      );
    }

    const detalleCambio = {
      idProducto: ID_PRODUCTO_MOVIMIENTO,
      cantidad: CANTIDAD_MOVIMIENTO,
      sedeOrigen: ID_SEDE_MOVIMIENTO,
      sedeDestino: ID_SEDEDESTINO_MOVIMIENTO,
      cliente: ID_CLIENTE_MOVIMIENTO,
      proveedor: ID_PROVEEDOR_MOVIMIENTO,
    };

    await client.query(
      `INSERT INTO AUDITORIA (
     TABLAAFECTADA_AUDITORIA,
     OPERACION_AUDITORIA,
     FECHAOPERACION_AUDITORIA,
     ID_USUARIO_AUDITORIA,
     DETALLESCAMBIO_AUDITORIA,
     ID_SEDE_AUDITORIA,
     ID_TIPOMOV_AUDITORIA
   ) VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [
        "MOVPRODUCTO",
        "INSERT",
        FECHA_MOVIMIENTO,
        data.ID_USUARIO,
        JSON.stringify(detalleCambio),
        ID_SEDE_MOVIMIENTO,
        ID_TIPOMOV_MOVIMIENTO,
      ]
    );

    await client.query("COMMIT");
    return result.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
