import { pool } from "../../../db.js";

export async function fetchAll() {
  const res = await pool.query("SELECT * FROM inventariolocal");
  return res.rows;
}

export async function fetchBySede(sedeId) {
  const res = await pool.query(
    `SELECT i.*, COALESCE(i.existencia_inventariolocal, 0) AS existencia_producto, p.*
     FROM INVENTARIOLOCAL i
     JOIN PRODUCTO p ON i.id_producto_inventariolocal = p.id_producto
     WHERE i.id_sede_inventariolocal = $1`,
    [sedeId]
  );
  return res.rows; // devuelve [], no lanza error
}


export async function insert(data) {
  const {
    id_producto_inventariolocal,
    id_sede_inventariolocal,
    existencia_inventariolocal,
    stockminimo_inventariolocal,
    stockmaximo_inventariolocal,
    estado_inventariolocal,
  } = data;

  if (
    !id_producto_inventariolocal ||
    !id_sede_inventariolocal ||
    existencia_inventariolocal === undefined ||
    stockmaximo_inventariolocal === undefined
  ) {
    throw { status: 400, message: 'Faltan campos obligatorios' };
  }

  const existe = await pool.query(
    `SELECT 1 FROM inventariolocal WHERE id_producto_inventariolocal = $1 AND id_sede_inventariolocal = $2`,
    [id_producto_inventariolocal, id_sede_inventariolocal]
  );
  if (existe.rows.length > 0) {
    throw { status: 409, message: 'Producto ya registrado en esta sede' };
  }

  const res = await pool.query(
    `INSERT INTO inventariolocal (
        id_producto_inventariolocal,
        id_sede_inventariolocal,
        existencia_inventariolocal,
        stockminimo_inventariolocal,
        stockmaximo_inventariolocal,
        estado_inventariolocal
     ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [
      id_producto_inventariolocal,
      id_sede_inventariolocal,
      existencia_inventariolocal,
      stockminimo_inventariolocal || null,
      stockmaximo_inventariolocal,
      estado_inventariolocal || 'A',
    ]
  );

  return res.rows[0];
}

export async function update(id, data) {
  const actual = await pool.query(
    `SELECT * FROM inventariolocal WHERE id_inventariolocal = $1`, [id]
  );
  if (actual.rowCount === 0) throw new Error('Inventario local no encontrado');

  const anterior = actual.rows[0];
  const campos = {
    id_producto_inventariolocal: data.id_producto_inventariolocal ?? anterior.id_producto_inventariolocal,
    id_sede_inventariolocal: data.id_sede_inventariolocal ?? anterior.id_sede_inventariolocal,
    existencia_inventariolocal: data.existencia_inventariolocal ?? anterior.existencia_inventariolocal,
    stockminimo_inventariolocal: data.stockminimo_inventariolocal ?? anterior.stockminimo_inventariolocal,
    stockmaximo_inventariolocal: data.stockmaximo_inventariolocal ?? anterior.stockmaximo_inventariolocal,
    estado_inventariolocal: data.estado_inventariolocal ?? anterior.estado_inventariolocal,
  };

  const res = await pool.query(
    `UPDATE inventariolocal SET 
      id_producto_inventariolocal = $1,
      id_sede_inventariolocal = $2,
      existencia_inventariolocal = $3,
      stockminimo_inventariolocal = $4,
      stockmaximo_inventariolocal = $5,
      estado_inventariolocal = $6
     WHERE id_inventariolocal = $7 RETURNING *`,
    [
      campos.id_producto_inventariolocal,
      campos.id_sede_inventariolocal,
      campos.existencia_inventariolocal,
      campos.stockminimo_inventariolocal,
      campos.stockmaximo_inventariolocal,
      campos.estado_inventariolocal,
      id,
    ]
  );

  return res.rows[0];
}

export async function addStock(idProducto, idSede, cantidad) {
  if (!cantidad || cantidad <= 0) {
    throw new Error("La cantidad debe ser mayor a 0");
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const exists = await client.query(
      `SELECT 1 FROM inventariolocal WHERE id_producto_inventariolocal = $1 AND id_sede_inventariolocal = $2`,
      [idProducto, idSede]
    );

    if (exists.rowCount === 0) {
      await client.query("ROLLBACK");
      throw new Error("El producto no está en esta sede");
    }

    await client.query(
      `UPDATE inventariolocal
       SET existencia_inventariolocal = existencia_inventariolocal + $1
       WHERE id_producto_inventariolocal = $2 AND id_sede_inventariolocal = $3`,
      [cantidad, idProducto, idSede]
    );

    await client.query(
      `UPDATE inventario
       SET existencia_inventario = existencia_inventario + $1
       WHERE id_producto_inventario = $2`,
      [cantidad, idProducto]
    );

    await client.query("COMMIT");
    return "Stock añadido exitosamente";
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function exists(idProducto, idSede) {
  const res = await pool.query(
    `SELECT id_inventariolocal FROM inventariolocal
     WHERE id_producto_inventariolocal = $1 AND id_sede_inventariolocal = $2`,
    [idProducto, idSede]
  );
  return res.rows.length > 0
    ? { existe: true, inventarioLocalId: res.rows[0].id_inventariolocal }
    : { existe: false };
}
