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

  const stockResult = await pool.query(
    "SELECT EXISTENCIA_INVENTARIOLOCAL FROM INVENTARIOLOCAL WHERE ID_PRODUCTO_INVENTARIOLOCAL = $1 AND ID_SEDE_INVENTARIOLOCAL = $2",
    [ID_PRODUCTO_MOVIMIENTO, ID_SEDE_MOVIMIENTO]
  );

  if (stockResult.rows.length === 0) {
    throw { status: 400, message: "El producto no existe en la sede origen" };
  }

  if (CANTIDAD_MOVIMIENTO > stockResult.rows[0].existencia_inventariolocal) {
    throw { status: 400, message: "Stock insuficiente en la sede origen" };
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

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

    await client.query(
      "UPDATE INVENTARIOLOCAL SET EXISTENCIA_INVENTARIOLOCAL = EXISTENCIA_INVENTARIOLOCAL - $1 WHERE ID_PRODUCTO_INVENTARIOLOCAL = $2 AND ID_SEDE_INVENTARIOLOCAL = $3",
      [CANTIDAD_MOVIMIENTO, ID_PRODUCTO_MOVIMIENTO, ID_SEDE_MOVIMIENTO]
    );

    if (ID_SEDEDESTINO_MOVIMIENTO) {
      const existeInventario = await client.query(
        "SELECT 1 FROM INVENTARIOLOCAL WHERE ID_PRODUCTO_INVENTARIOLOCAL = $1 AND ID_SEDE_INVENTARIOLOCAL = $2",
        [ID_PRODUCTO_MOVIMIENTO, ID_SEDEDESTINO_MOVIMIENTO]
      );

      if (existeInventario.rowCount > 0) {
        await client.query(
          "UPDATE INVENTARIOLOCAL SET EXISTENCIA_INVENTARIOLOCAL = EXISTENCIA_INVENTARIOLOCAL + $1 WHERE ID_PRODUCTO_INVENTARIOLOCAL = $2 AND ID_SEDE_INVENTARIOLOCAL = $3",
          [CANTIDAD_MOVIMIENTO, ID_PRODUCTO_MOVIMIENTO, ID_SEDEDESTINO_MOVIMIENTO]
        );
      } else {
        if (STOCK_MINIMO === null || STOCK_MAXIMO === null) {
          throw { status: 400, message: "FALTA_STOCK: Se requiere definir stock mínimo y máximo para la sede destino." };
        }

        await client.query(
          `INSERT INTO INVENTARIOLOCAL (
            ID_PRODUCTO_INVENTARIOLOCAL, ID_SEDE_INVENTARIOLOCAL, EXISTENCIA_INVENTARIOLOCAL, STOCKMINIMO_INVENTARIOLOCAL, STOCKMAXIMO_INVENTARIOLOCAL
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

    await client.query("COMMIT");
    return result.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
