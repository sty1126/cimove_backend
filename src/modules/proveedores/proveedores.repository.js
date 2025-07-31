import { pool } from "../../db.js";

export const ProveedoresRepository = {
  obtenerTodos() {
    return pool.query(`
      SELECT p.*, tp.NOMBRE_TIPOPROVEEDOR
      FROM PROVEEDOR p
      INNER JOIN TIPOPROVEEDOR tp ON p.ID_TIPOPROVEEDOR_PROVEEDOR = tp.ID_TIPOPROVEEDOR
    `);
  },

  obtenerPorId(id) {
    return pool.query(
      `SELECT p.*, tp.NOMBRE_TIPOPROVEEDOR
       FROM PROVEEDOR p
       INNER JOIN TIPOPROVEEDOR tp ON p.ID_TIPOPROVEEDOR_PROVEEDOR = tp.ID_TIPOPROVEEDOR
       WHERE p.ID_PROVEEDOR = $1`,
      [id]
    );
  },

  obtenerTipos() {
    return pool.query(`SELECT * FROM TIPOPROVEEDOR WHERE ESTADO_TIPOPROVEEDOR = 'A'`);
  },

  crearTipo(nombre) {
    return pool.query(
      `INSERT INTO TIPOPROVEEDOR (NOMBRE_TIPOPROVEEDOR, ESTADO_TIPOPROVEEDOR) VALUES ($1, 'A') RETURNING *`,
      [nombre]
    );
  },

  crearProveedor(data) {
    const {
      id_proveedor,
      nombre_proveedor,
      id_ciudad_proveedor,
      direccion_proveedor,
      telefono_proveedor,
      email_proveedor,
      id_tipoproveedor_proveedor,
      representante_proveedor,
      fecharegistro_proveedor,
      saldo_proveedor,
      digitoverificacion_proveedor,
    } = data;

    return pool.query(
      `INSERT INTO PROVEEDOR (
        id_proveedor, nombre_proveedor, id_ciudad_proveedor, direccion_proveedor, 
        telefono_proveedor, email_proveedor, id_tipoproveedor_proveedor, representante_proveedor, 
        fecharegistro_proveedor, saldo_proveedor, digitoverificacion_proveedor
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [
        id_proveedor,
        nombre_proveedor,
        id_ciudad_proveedor,
        direccion_proveedor,
        telefono_proveedor,
        email_proveedor,
        id_tipoproveedor_proveedor,
        representante_proveedor,
        fecharegistro_proveedor,
        saldo_proveedor,
        digitoverificacion_proveedor,
      ]
    );
  },

  proveedorExiste(id) {
    return pool.query("SELECT * FROM PROVEEDOR WHERE id_proveedor = $1", [id]);
  },

  actualizarProveedor(id, datos) {
    return pool.query(
      `UPDATE PROVEEDOR 
       SET NOMBRE_PROVEEDOR = $1, ID_CIUDAD_PROVEEDOR = $2, DIRECCION_PROVEEDOR = $3, TELEFONO_PROVEEDOR = $4, 
           EMAIL_PROVEEDOR = $5, ID_TIPOPROVEEDOR_PROVEEDOR = $6, REPRESENTANTE_PROVEEDOR = $7, 
           SALDO_PROVEEDOR = COALESCE($8, SALDO_PROVEEDOR), 
           ESTADO_PROVEEDOR = COALESCE($9, ESTADO_PROVEEDOR)
       WHERE ID_PROVEEDOR = $10 RETURNING *`,
      [
        datos.nombre_proveedor,
        datos.id_ciudad_proveedor,
        datos.direccion_proveedor,
        datos.telefono_proveedor,
        datos.email_proveedor,
        datos.id_tipoproveedor_proveedor,
        datos.representante_proveedor,
        datos.saldo_proveedor,
        datos.estado_proveedor,
        id,
      ]
    );
  },

  eliminarProveedor(id) {
    return pool.query(
      "UPDATE PROVEEDOR SET ESTADO_PROVEEDOR = 'I' WHERE ID_PROVEEDOR = $1 RETURNING *",
      [id]
    );
  },
};
