import { pool } from "../db.js";

// Crear una factura de servicio técnico
export const createFacturaServicioTecnico = async (req, res) => {
  try {
    console.log(req.body); // ← Aquí

    const {
      id_cliente_factura,
      total_factura,
      descuento_factura,
      iva_factura,
      subtotal_factura,
      aplica_garantia_factura,
      fecha_garantia_factura,
      saldo_factura,
      id_proveedor_servicio,
      id_sede_servicio,
      nombre_servicio,
      descripcion_servicio,
      fecha_servicio,
      fecha_entrega,
      tipo_dano,
      clave_dispositivo,
      costo_servicio,
      abono,
      garantia_aplica,
      fecha_garantia_servicio,
      contacto_alternativo,
      estadotecnico,
      autorizado,
    } = req.body;

    // Validación de campos obligatorios mínimos
    if (
      !id_cliente_factura ||
      !total_factura ||
      !iva_factura ||
      !subtotal_factura ||
      !id_sede_servicio ||
      !nombre_servicio ||
      !descripcion_servicio ||
      !costo_servicio
    ) {
      return res.status(400).json({
        error: "Todos los campos obligatorios deben ser proporcionados.",
      });
    }

    // Si el id_proveedor_servicio es null, usar el proveedor temporal
    const proveedorFinal = id_proveedor_servicio || "PROV_TEMP_123";

    // Insertar en FACTURA
    const resultFactura = await pool.query(
      `INSERT INTO FACTURA (
        ID_CLIENTE_FACTURA, TOTAL_FACTURA, DESCUENTO_FACTURA, IVA_FACTURA, 
        SUBTOTAL_FACTURA, APLICAGARANTIA_FACTURA, FECHAGARANTIA_FACTURA, 
        SALDO_FACTURA, ESTADO_FACTURA
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'A') RETURNING ID_FACTURA`,
      [
        id_cliente_factura,
        total_factura,
        descuento_factura ?? 0,
        iva_factura,
        subtotal_factura,
        aplica_garantia_factura ?? false,
        fecha_garantia_factura || null,
        saldo_factura ?? total_factura,
      ]
    );

    const id_factura = resultFactura.rows[0].id_factura;

    // Insertar en SERVICIOTECNICO
    const resultServicio = await pool.query(
      `INSERT INTO SERVICIOTECNICO (
        ID_SEDE_SERVICIOTECNICO,
        ID_PROVEEDOR_SERVICIOTECNICO,
        ID_CLIENTE_SERVICIOTECNICO,
        ID_FACTURA_SERVICIOTECNICO,
        NOMBRE_SERVICIOTECNICO,
        DESCRIPCION_SERVICIOTECNICO,
        FECHA_SERVICIOTECNICO,
        FECHA_ENTREGA_SERVICIOTECNICO,
        TIPO_DANO_SERVICIOTECNICO,
        CLAVE_DISPOSITIVO_SERVICIOTECNICO,
        COSTO_SERVICIOTECNICO,
        ABONO_SERVICIOTECNICO,
        GARANTIA_APLICA_SERVICIOTECNICO,
        FECHA_GARANTIA_SERVICIOTECNICO,
        NUMERO_CONTACTO_ALTERNATIVO_SERVICIO,
        ESTADOTECNICO_SERVICIOTECNICO,
        AUTORIZADO_SERVICIOTECNICO,
        ESTADO_SERVICIOTECNICO
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9,
        $10, $11, $12, $13, $14, $15, $16, $17, 'A'
      ) RETURNING *`,
      [
        id_sede_servicio,
        proveedorFinal, // Usamos el proveedor temporal si no se especifica uno
        id_cliente_factura,
        id_factura,
        nombre_servicio,
        descripcion_servicio,
        fecha_servicio,
        fecha_entrega || null,
        tipo_dano || "",
        clave_dispositivo || "",
        costo_servicio,
        abono ?? 0,
        garantia_aplica ?? false,
        fecha_garantia_servicio || null,
        contacto_alternativo || "",
        estadotecnico ?? "D",
        autorizado ?? true,
      ]
    );

    res.status(201).json(resultServicio.rows[0]);
  } catch (error) {
    console.error("Error al crear factura de servicio técnico:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Agregar métodos de pago a una factura de servicio técnico
export const addMetodoPago = async (req, res) => {
  try {
    const { id_factura, id_tipometodopago, monto_metodopago } = req.body;

    if (!id_factura || !id_tipometodopago || !monto_metodopago) {
      return res.status(400).json({
        error: "Todos los campos obligatorios deben ser proporcionados",
      });
    }

    const result = await pool.query(
      "INSERT INTO METODOPAGO (ID_TIPOMETODOPAGO_METODOPAGO, ID_FACTURA_METODOPAGO, MONTO_METODOPAGO, ESTADO_METODOPAGO) VALUES ($1, $2, $3, 'A') RETURNING *",
      [id_tipometodopago, id_factura, monto_metodopago]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al agregar método de pago:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener detalles completos de una factura de servicio técnico con JOIN y SELECT *
export const getFacturaServicioTecnico = async (req, res) => {
  try {
    // Traer todas las facturas de servicio técnico
    const query = `
      SELECT 
        ST.*, 
        F.ID_FACTURA,
        F.FECHA_FACTURA,
        F.ID_CLIENTE_FACTURA,
        F.TOTAL_FACTURA,
        F.DESCUENTO_FACTURA,
        F.IVA_FACTURA,
        F.SUBTOTAL_FACTURA,
        F.APLICAGARANTIA_FACTURA,
        F.FECHAGARANTIA_FACTURA,
        F.SALDO_FACTURA,
        F.ESTADO_FACTURA
      FROM 
        SERVICIOTECNICO ST
      INNER JOIN 
        FACTURA F
      ON 
        ST.ID_FACTURA_SERVICIOTECNICO = F.ID_FACTURA
      WHERE 
        ST.ESTADO_SERVICIOTECNICO = 'A';
    `;

    const result = await pool.query(query);

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ error: "No hay facturas de servicio técnico" });
    }

    // Organizar la información
    const facturas = result.rows.map((row) => ({
      factura: {
        id_factura: row.id_factura,
        fecha_factura: row.fecha_factura,
        id_cliente_factura: row.id_cliente_factura,
        total_factura: row.total_factura,
        descuento_factura: row.descuento_factura,
        iva_factura: row.iva_factura,
        subtotal_factura: row.subtotal_factura,
        aplicagarantia_factura: row.aplicagarantia_factura,
        fechagarantia_factura: row.fechagarantia_factura,
        saldo_factura: row.saldo_factura,
        estado_factura: row.estado_factura,
      },
      servicioTecnico: {
        id_serviciotecnico: row.id_serviciotecnico,
        id_sede_serviciotecnico: row.id_sede_serviciotecnico,
        id_proveedor_serviciotecnico: row.id_proveedor_serviciotecnico,
        id_cliente_serviciotecnico: row.id_cliente_serviciotecnico,
        id_factura_serviciotecnico: row.id_factura_serviciotecnico,
        nombre_serviciotecnico: row.nombre_serviciotecnico,
        descripcion_serviciotecnico: row.descripcion_serviciotecnico,
        fecha_serviciotecnico: row.fecha_serviciotecnico,
        fecha_entrega_serviciotecnico: row.fecha_entrega_serviciotecnico,
        tipo_daño_serviciotecnico: row.tipo_daño_serviciotecnico,
        clave_dispositivo_serviciotecnico:
          row.clave_dispositivo_serviciotecnico,
        costo_serviciotecnico: row.costo_serviciotecnico,
        abono_serviciotecnico: row.abono_serviciotecnico,
        garantia_aplica_serviciotecnico: row.garantia_aplica_serviciotecnico,
        fecha_garantia_serviciotecnico: row.fecha_garantia_serviciotecnico,
        numero_contacto_alternativo_servicio:
          row.numero_contacto_alternativo_servicio,
        estadotecnico_serviciotecnico: row.estadotecnico_serviciotecnico,
        autorizado_serviciotecnico: row.autorizado_serviciotecnico,
        estado_serviciotecnico: row.estado_serviciotecnico,
      },
    }));

    res.json(facturas);
  } catch (error) {
    console.error("Error al obtener facturas de servicio técnico:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Actualizar diagnóstico de un servicio técnico
export const actualizarDiagnostico = async (req, res) => {
  const { id } = req.params;
  const { diagnostico } = req.body;

  try {
    if (!diagnostico) {
      return res.status(400).json({
        error: "El diagnóstico es obligatorio",
      });
    }

    const result = await pool.query(
      "UPDATE SERVICIOTECNICO SET DIAGNOSTICO_SERVICIOTECNICO = $1 WHERE ID_SERVICIOTECNICO = $2 RETURNING *",
      [diagnostico, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Servicio técnico no encontrado" });
    }

    res.json({
      message: "Diagnóstico actualizado correctamente",
      servicio: result.rows[0],
    });
  } catch (error) {
    console.error("Error al actualizar diagnóstico:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Autorizar servicio técnico para continuar reparación
export const autorizarServicioTecnico = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "UPDATE SERVICIOTECNICO SET ESTADO_SERVICIOTECNICO = 'Autorizado' WHERE ID_SERVICIOTECNICO = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Servicio técnico no encontrado" });
    }

    res.json({
      message: "Servicio técnico autorizado para reparación",
      servicio: result.rows[0],
    });
  } catch (error) {
    console.error("Error al autorizar servicio técnico:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Facturar servicio técnico
export const facturarServicioTecnico = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "UPDATE SERVICIOTECNICO SET ESTADO_SERVICIOTECNICO = 'Facturado' WHERE ID_SERVICIOTECNICO = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Servicio técnico no encontrado" });
    }

    res.json({
      message: "Servicio técnico facturado correctamente",
      servicio: result.rows[0],
    });
  } catch (error) {
    console.error("Error al facturar servicio técnico:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
