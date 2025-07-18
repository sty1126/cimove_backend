import { pool } from "../../db.js";

export async function fetchAll() {
  const result = await pool.query("SELECT * FROM inventario");
  return result.rows;
}

export async function fetchById(id) {
  const result = await pool.query("SELECT * FROM inventario WHERE id_inventario = $1", [id]);
  if (result.rows.length === 0) throw new Error("Inventario no encontrado");
  return result.rows[0];
}

export async function insert({ id_producto_inventario, existencia_inventario, estado_inventario }) {
  const result = await pool.query(
    `INSERT INTO inventario (id_producto_inventario, existencia_inventario, estado_inventario)
     VALUES ($1, $2, $3) RETURNING *`,
    [id_producto_inventario, existencia_inventario, estado_inventario || 'A']
  );
  return result.rows[0];
}

export async function update(id, data) {
  const current = await fetchById(id);

  const updated = {
    id_producto_inventario: data.id_producto_inventario || current.id_producto_inventario,
    existencia_inventario: data.existencia_inventario || current.existencia_inventario,
    estado_inventario: data.estado_inventario || current.estado_inventario,
  };

  const result = await pool.query(
    `UPDATE inventario
     SET id_producto_inventario = $1, existencia_inventario = $2, estado_inventario = $3
     WHERE id_inventario = $4 RETURNING *`,
    [updated.id_producto_inventario, updated.existencia_inventario, updated.estado_inventario, id]
  );
  return result.rows[0];
}
