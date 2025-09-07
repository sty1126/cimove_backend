import { pool } from "../../db.js";

export async function fetchMovimientos() {
  const result = await pool.query("SELECT * FROM MOVPRODUCTO");
  return result.rows;
}

export async function fetchTipoMovimientos() {
  const result = await pool.query(
    "SELECT * FROM TIPOMOV WHERE ESTADO_TIPOMOV = 'A'"
  );
  return result.rows;
}
import { pool } from "../../db.js";

export async function fetchMovimientos() {
  const result = await pool.query("SELECT * FROM MOVPRODUCTO");
  return result.rows;
}

export async function fetchTipoMovimientos() {
  const result = await pool.query(
    "SELECT * FROM TIPOMOV WHERE ESTADO_TIPOMOV = 'A'"
  );
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
    STOCK_MAXIMO = null
  } = data;

  if (!ID_TIPOMOV_MOVIMIENTO || !ID_PRODUCTO_MOVIMIENTO || !CANTIDAD_MOVIMIENTO || !ID_SEDE_MOVIMIENTO) {
    throw { status: 400, message: "Campos obligatorios faltantes" };
  }

  if (ID_SEDE_MOVIMIENTO === ID_SEDEDESTINO_MOVIMIENTO) {
    throw { status: 400, message: "La sede origen y destino no pueden ser iguales" };
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
        ID_PROVEEDOR_MOVIMIENTO
      ]
    );

    // ------------------------------
    // Manejo inventario según tipo
    // ------------------------------

    // 1. Entrada por Ajuste → SUMA al inventario local
    if (ID_TIPOMOV_MOVIMIENTO === 1) {
      await client.query(
        `UPDATE INVENTARIOLOCAL 
         SET EXISTENCIA_INVENTARIOLOCAL = EXISTENCIA_INVENTARIOLOCAL + $1 
         WHERE ID_PRODUCTO_INVENTARIOLOCAL = $2 AND ID_SEDE_INVENTARIOLOCAL = $3`,
        [CANTIDAD_MOVIMIENTO, ID_PRODUCTO_MOVIMIENTO, ID_SEDE_MOVIMIENTO]
      );
    }

    // 2. Salida por Ajuste, 3. Venta Crédito, 4. Venta Contado → RESTA en inventario local
    if ([2, 3, 4].includes(ID_TIPOMOV_MOVIMIENTO)) {
      await client.query(
        `UPDATE INVENTARIOLOCAL 
         SET EXISTENCIA_INVENTARIOLOCAL = EXISTENCIA_INVENTARIOLOCAL - $1 
         WHERE ID_PRODUCTO_INVENTARIOLOCAL = $2 AND ID_SEDE_INVENTARIOLOCAL = $3`,
        [CANTIDAD_MOVIMIENTO, ID_PRODUCTO_MOVIMIENTO, ID_SEDE_MOVIMIENTO]
      );
    }

    // 5. Cambio de sede → RESTA en origen y SUMA en destino
    if (ID_TIPOMOV_MOVIMIENTO === 5) {
      await client.query(
        `UPDATE INVENTARIOLOCAL 
         SET EXISTENCIA_INVENTARIOLOCAL = EXISTENCIA_INVENTARIOLOCAL - $1 
         WHERE ID_PRODUCTO_INVENTARIOLOCAL = $2 AND ID_SEDE_INVENTARIOLOCAL = $3`,
        [CANTIDAD_MOVIMIENTO, ID_PRODUCTO_MOVIMIENTO, ID_SEDE_MOVIMIENTO]
      );

      const existeInventario = await client.query(
        `SELECT 1 FROM INVENTARIOLOCAL 
         WHERE ID_PRODUCTO_INVENTARIOLOCAL = $1 AND ID_SEDE_INVENTARIOLOCAL = $2`,
        [ID_PRODUCTO_MOVIMIENTO, ID_SEDEDESTINO_MOVIMIENTO]
      );

      if (existeInventario.rowCount > 0) {
        await client.query(
          `UPDATE INVENTARIOLOCAL 
           SET EXISTENCIA_INVENTARIOLOCAL = EXISTENCIA_INVENTARIOLOCAL + $1 
           WHERE ID_PRODUCTO_INVENTARIOLOCAL = $2 AND ID_SEDE_INVENTARIOLOCAL = $3`,
          [CANTIDAD_MOVIMIENTO, ID_PRODUCTO_MOVIMIENTO, ID_SEDEDESTINO_MOVIMIENTO]
        );
      } else {
        if (STOCK_MINIMO === null || STOCK_MAXIMO === null) {
          throw { status: 400, message: "FALTA_STOCK: Se requiere definir stock mínimo y máximo para la sede destino." };
        }

        await client.query(
          `INSERT INTO INVENTARIOLOCAL (
            ID_PRODUCTO_INVENTARIOLOCAL, ID_SEDE_INVENTARIOLOCAL, EXISTENCIA_INVENTARIOLOCAL, 
            STOCKMINIMO_INVENTARIOLOCAL, STOCKMAXIMO_INVENTARIOLOCAL
          ) VALUES ($1, $2, $3, $4, $5)`,
          [
            ID_PRODUCTO_MOVIMIENTO,
            ID_SEDEDESTINO_MOVIMIENTO,
            CANTIDAD_MOVIMIENTO,
            STOCK_MINIMO,
            STOCK_MAXIMO
          ]
        );
      }
    }

    // 6. Ingreso por Garantía → SUMA en INVENTARIOLOCAL_ESTADO con G
    if (ID_TIPOMOV_MOVIMIENTO === 6) {
      await client.query(
        `INSERT INTO INVENTARIOLOCAL_ESTADO (ID_PRODUCTO, ID_SEDE, ESTADO, CANTIDAD) 
         VALUES ($1, $2, 'G', $3)
         ON CONFLICT (ID_PRODUCTO, ID_SEDE, ESTADO) 
         DO UPDATE SET CANTIDAD = INVENTARIOLOCAL_ESTADO.CANTIDAD + EXCLUDED.CANTIDAD`,
        [ID_PRODUCTO_MOVIMIENTO, ID_SEDE_MOVIMIENTO, CANTIDAD_MOVIMIENTO]
      );
    }

    // 7. Salida por Garantía → RESTA en INVENTARIOLOCAL (entregas producto nuevo al cliente)
    if (ID_TIPOMOV_MOVIMIENTO === 7) {
      await client.query(
        `UPDATE INVENTARIOLOCAL 
         SET EXISTENCIA_INVENTARIOLOCAL = EXISTENCIA_INVENTARIOLOCAL - $1 
         WHERE ID_PRODUCTO_INVENTARIOLOCAL = $2 AND ID_SEDE_INVENTARIOLOCAL = $3`,
        [CANTIDAD_MOVIMIENTO, ID_PRODUCTO_MOVIMIENTO, ID_SEDE_MOVIMIENTO]
      );
    }

    // 8. Ingreso por Reparación → SUMA en INVENTARIOLOCAL_ESTADO con R
    if (ID_TIPOMOV_MOVIMIENTO === 8) {
      await client.query(
        `INSERT INTO INVENTARIOLOCAL_ESTADO (ID_PRODUCTO, ID_SEDE, ESTADO, CANTIDAD) 
         VALUES ($1, $2, 'R', $3)
         ON CONFLICT (ID_PRODUCTO, ID_SEDE, ESTADO) 
         DO UPDATE SET CANTIDAD = INVENTARIOLOCAL_ESTADO.CANTIDAD + EXCLUDED.CANTIDAD`,
        [ID_PRODUCTO_MOVIMIENTO, ID_SEDE_MOVIMIENTO, CANTIDAD_MOVIMIENTO]
      );
    }

    // 9. Salida por Reparación → RESTA en INVENTARIOLOCAL_ESTADO con R
    if (ID_TIPOMOV_MOVIMIENTO === 9) {
      await client.query(
        `UPDATE INVENTARIOLOCAL_ESTADO 
         SET CANTIDAD = CANTIDAD - $1 
         WHERE ID_PRODUCTO = $2 AND ID_SEDE = $3 AND ESTADO = 'R'`,
        [CANTIDAD_MOVIMIENTO, ID_PRODUCTO_MOVIMIENTO, ID_SEDE_MOVIMIENTO]
      );
    }

    await client.query("COMMIT");
    return result.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
