import { pool } from "../db.js";

// Registrar un nuevo servicio técnico
export const createServicioTecnico = async (req, res) => {
  const {
    idServicioTecnico,
    idSede,
    idProveedor,
    idCliente,
    idFactura,
    nombre,
    descripcion,
    fecha,
    costo,
  } = req.body;

  try {
    await pool.query(
      `INSERT INTO SERVICIOTECNICO (
        ID_SERVICIOTECNICO, ID_SEDE_SERVICIOTECNICO, ID_PROVEEDOR_SERVICIOTECNICO,
        ID_CLIENTE_SERVICIOTECNICO, ID_FACTURA_SERVICIOTECNICO,
        NOMBRE_SERVICIOTECNICO, DESCRIPCION_SERVICIOTECNICO,
        FECHA_SERVICIOTECNICO, COSTO_SERVICIOTECNICO
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [
        idServicioTecnico,
        idSede,
        idProveedor,
        idCliente,
        idFactura,
        nombre,
        descripcion,
        fecha,
        costo,
      ]
    );
    res
      .status(201)
      .json({ message: "Servicio técnico registrado correctamente" });
  } catch (error) {
    console.error("Error creando servicio técnico:", error);
    res.status(500).json({ error: "Error al registrar el servicio técnico" });
  }
};

export const updateServicioTecnico = async (req, res) => {
  const { id } = req.params;
  const {
    idSede,
    idProveedor,
    idCliente,
    idFactura,
    nombre,
    descripcion,
    fecha,
    costo,
  } = req.body;

  try {
    await pool.query(
      `UPDATE SERVICIOTECNICO
         SET ID_SEDE_SERVICIOTECNICO = $1,
             ID_PROVEEDOR_SERVICIOTECNICO = $2,
             ID_CLIENTE_SERVICIOTECNICO = $3,
             ID_FACTURA_SERVICIOTECNICO = $4,
             NOMBRE_SERVICIOTECNICO = $5,
             DESCRIPCION_SERVICIOTECNICO = $6,
             FECHA_SERVICIOTECNICO = $7,
             COSTO_SERVICIOTECNICO = $8
         WHERE ID_SERVICIOTECNICO = $9`,
      [
        idSede,
        idProveedor,
        idCliente,
        idFactura,
        nombre,
        descripcion,
        fecha,
        costo,
        id,
      ]
    );
    res.json({ message: "Servicio técnico actualizado correctamente" });
  } catch (error) {
    console.error("Error actualizando servicio técnico:", error);
    res.status(500).json({ error: "Error al actualizar el servicio técnico" });
  }
};

export const changeEstadoServicioTecnico = async (req, res) => {
  const { id } = req.params;
  const { nuevoEstado } = req.body;

  try {
    await pool.query(
      `UPDATE SERVICIOTECNICO
         SET ESTADO_SERVICIOTECNICO = $1
         WHERE ID_SERVICIOTECNICO = $2`,
      [nuevoEstado, id]
    );
    res.json({ message: "Estado del servicio técnico actualizado" });
  } catch (error) {
    console.error("Error cambiando estado:", error);
    res.status(500).json({ error: "Error al cambiar el estado" });
  }
};
export const getServiciosTecnicos = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM SERVICIOTECNICO`);
    res.json(result.rows);
  } catch (error) {
    console.error("Error obteniendo servicios técnicos:", error);
    res.status(500).json({ error: "Error al listar servicios técnicos" });
  }
};
