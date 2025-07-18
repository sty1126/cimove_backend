import { pool } from "../../db.js";

export const obtenerCiudadesActivas = async () => {
  const result = await pool.query(
    "SELECT id_ciudad, nombre_ciudad FROM ciudad WHERE estado_ciudad = 'A'"
  );
  return result.rows;
};


// Para PostgreSQL usamos RETURNING para obtener el registro insertado
export const insertarCiudad = async (nombre) => {
  const result = await pool.query(
    "INSERT INTO CIUDAD (ID_CIUDAD, NOMBRE_CIUDAD, ESTADO_CIUDAD) VALUES (gen_random_uuid(), $1, 'A') RETURNING *",
    [nombre]
  );
  return result.rows[0];
};
