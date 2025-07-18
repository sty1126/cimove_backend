import { pool } from "../../db.js";

export const obtenerCategoriasActivas = async () => {
  const result = await pool.query(
    "SELECT id_categoria, descripcion_categoria FROM CATEGORIA WHERE estado_categoria = 'A'"
  );
  return result.rows;
};

export const insertarCategoria = async (descripcion) => {
  const result = await pool.query(
    "INSERT INTO CATEGORIA (descripcion_categoria, estado_categoria) VALUES ($1, 'A') RETURNING *",
    [descripcion]
  );
  return result.rows[0];
};
