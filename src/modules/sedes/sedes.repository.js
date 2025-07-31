import { pool } from "../../db.js";

export const SedesRepository = {
  obtenerTodas() {
    return pool.query(
      `SELECT id_sede, nombre_sede, id_ciudad_sede, direccion_sede, numeroempleados_sede, telefono_sede 
       FROM SEDE WHERE estado_sede = 'A'`
    );
  },

  crear({ nombre_sede, id_ciudad_sede, direccion_sede, numeroempleados_sede, telefono_sede }) {
    return pool.query(
      `INSERT INTO SEDE 
        (nombre_sede, id_ciudad_sede, direccion_sede, numeroempleados_sede, telefono_sede, estado_sede) 
       VALUES ($1, $2, $3, $4, $5, 'A') 
       RETURNING *`,
      [nombre_sede, id_ciudad_sede, direccion_sede, numeroempleados_sede, telefono_sede]
    );
  },

  desactivar(id_sede) {
    return pool.query(
      `UPDATE SEDE SET estado_sede = 'I' WHERE id_sede = $1 RETURNING *`,
      [id_sede]
    );
  },

  obtenerIdPorNombre(nombre_sede) {
    return pool.query(
      `SELECT id_sede FROM SEDE WHERE nombre_sede = $1 AND estado_sede = 'A'`,
      [nombre_sede]
    );
  }
};
