import { pool } from "../db.js";
// Crear un nuevo servicio técnico
export const createServicioTecnico = async (req, res) => {
  const client = await pool.connect(); // Para manejar transacción manualmente
  try {
    await client.query("BEGIN"); // Iniciar transacción

    if (!req.body) {
      return res
        .status(400)
        .json({ error: "No se envió body en la solicitud" });
    }

    const {
      id_cliente,
      id_sede,
      id_proveedor,
      nombre_servicio,
      descripcion_servicio,
      fecha_servicio,
      fecha_entrega,
      tipo_dano,
      clave_dispositivo,
      costo,
      abono,
      garantia_aplica,
      fecha_garantia,
      numero_contacto_alternativo,
      autorizado,
      metodos_pago = [],
    } = req.body;

    if (
      !id_cliente ||
      !id_sede ||
      !nombre_servicio ||
      !descripcion_servicio ||
      !fecha_servicio ||
      !costo
    ) {
      return res.status(400).json({
        error: "Faltan campos obligatorios para crear el servicio técnico",
      });
    }

    // Insertar factura
    const facturaResult = await client.query(
      `INSERT INTO FACTURA 
        (fecha_factura, id_cliente_factura, total_factura, descuento_factura, iva_factura, subtotal_factura, aplicagarantia_factura, fechagarantia_factura, saldo_factura) 
      VALUES 
        (CURRENT_DATE, $1, $2, 0, 0, $2, $3, $4, $2) 
      RETURNING id_factura`,
      [id_cliente, costo, garantia_aplica || false, fecha_garantia || null]
    );

    const idFactura = facturaResult.rows[0].id_factura;

    const proveedorFinal =
      id_proveedor && id_proveedor.trim() !== ""
        ? id_proveedor
        : "PROV_TEMP_123";

    const servicioTecnicoResult = await client.query(
      `INSERT INTO SERVICIOTECNICO 
        (id_sede_serviciotecnico, id_proveedor_serviciotecnico, id_cliente_serviciotecnico, id_factura_serviciotecnico, 
         nombre_serviciotecnico, descripcion_serviciotecnico, fecha_serviciotecnico, fecha_entrega_serviciotecnico, 
         tipo_dano_serviciotecnico, clave_dispositivo_serviciotecnico, costo_serviciotecnico, abono_serviciotecnico, 
         garantia_aplica_serviciotecnico, fecha_garantia_serviciotecnico, numero_contacto_alternativo_servicio, 
         autorizado_serviciotecnico)
      VALUES 
        ($1, $2, $3, $4, 
         $5, $6, $7, $8, 
         $9, $10, $11, $12, 
         $13, $14, $15, $16)
      RETURNING *`,
      [
        id_sede,
        proveedorFinal,
        id_cliente,
        idFactura,
        nombre_servicio,
        descripcion_servicio,
        fecha_servicio,
        fecha_entrega || null,
        tipo_dano || null,
        clave_dispositivo || null,
        costo,
        abono || 0,
        garantia_aplica || false,
        fecha_garantia || null,
        numero_contacto_alternativo || null,
        autorizado || false,
      ]
    );

    // Insertar métodos de pago si hay abono y metodos enviados
    for (const metodo of metodos_pago) {
      if (metodo?.id_tipo && metodo?.monto > 0) {
        await client.query(
          `INSERT INTO METODOPAGO 
            (id_factura_metodopago, id_tipometodopago_metodopago, monto_metodopago)
          VALUES ($1, $2, $3)`,
          [idFactura, metodo.id_tipo, metodo.monto]
        );
      }
    }

    await client.query("COMMIT");

    res.status(201).json({
      message: "Servicio técnico creado exitosamente",
      servicioTecnico: servicioTecnicoResult.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error al crear servicio técnico:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  } finally {
    client.release();
  }
};

export const getServiciosTecnicos = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        st.id_serviciotecnico,
        st.nombre_serviciotecnico,
        st.descripcion_serviciotecnico,
        st.fecha_serviciotecnico,
        st.fecha_entrega_serviciotecnico,
        st.tipo_dano_serviciotecnico,
        st.costo_serviciotecnico,
        st.abono_serviciotecnico,
        st.estadotecnico_serviciotecnico,
        st.autorizado_serviciotecnico,
        st.estado_serviciotecnico,
        -- Nombre del cliente
        COALESCE(cn.nombre_cliente, cj.razonsocial_cliente) AS nombre_cliente,
        pr.nombre_proveedor,
        fa.total_factura,
        fa.saldo_factura,
        fa.fecha_factura,
        se.nombre_sede,
        -- Métodos de pago como array
        COALESCE(mp.metodos_pago, '[]') AS metodos_pago
      FROM SERVICIOTECNICO st
      INNER JOIN CLIENTE cl ON cl.id_cliente = st.id_cliente_serviciotecnico
      LEFT JOIN CLIENTENATURAL cn ON cn.id_cliente = cl.id_cliente
      LEFT JOIN CLIENTEJURIDICO cj ON cj.id_cliente = cl.id_cliente
      LEFT JOIN PROVEEDOR pr ON pr.id_proveedor = st.id_proveedor_serviciotecnico
      INNER JOIN FACTURA fa ON fa.id_factura = st.id_factura_serviciotecnico
      INNER JOIN SEDE se ON se.id_sede = st.id_sede_serviciotecnico
      LEFT JOIN (
        SELECT 
          mp.id_factura_metodopago,
          json_agg(
            json_build_object(
              'id_metodopago', mp.id_metodopago,
              'id_tipo', mp.id_tipometodopago_metodopago,
              'nombre_tipo', tp.nombre_tipometodopago,
              'monto', mp.monto_metodopago,
              'estado', mp.estado_metodopago
            )
          ) AS metodos_pago
        FROM METODOPAGO mp
        INNER JOIN TIPOMETODOPAGO tp ON tp.id_tipometodopago = mp.id_tipometodopago_metodopago
        GROUP BY mp.id_factura_metodopago
      ) mp ON mp.id_factura_metodopago = fa.id_factura
      WHERE st.estado_serviciotecnico = 'A'
      ORDER BY st.fecha_serviciotecnico DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener servicios técnicos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Actualizar un servicio técnico existente
export const updateServicioTecnico = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ error: "Se requiere el ID del servicio técnico a actualizar" });
    }

    if (!req.body) {
      return res
        .status(400)
        .json({ error: "No se envió body en la solicitud" });
    }

    const {
      id_cliente,
      id_sede,
      id_proveedor,
      nombre_servicio,
      descripcion_servicio,
      fecha_servicio,
      fecha_entrega,
      tipo_dano,
      clave_dispositivo,
      costo,
      abono,
      garantia_aplica,
      fecha_garantia,
      numero_contacto_alternativo,
      autorizado,
    } = req.body;

    // Validaciones básicas
    if (
      !id_cliente ||
      !id_sede ||
      !nombre_servicio ||
      !descripcion_servicio ||
      !fecha_servicio ||
      !costo
    ) {
      return res.status(400).json({
        error: "Faltan campos obligatorios para actualizar el servicio técnico",
      });
    }

    // Actualizar el servicio técnico
    const updateResult = await client.query(
      `UPDATE SERVICIOTECNICO SET
        id_sede_serviciotecnico = $1,
        id_proveedor_serviciotecnico = $2,
        id_cliente_serviciotecnico = $3,
        nombre_serviciotecnico = $4,
        descripcion_serviciotecnico = $5,
        fecha_serviciotecnico = $6,
        fecha_entrega_serviciotecnico = $7,
        tipo_dano_serviciotecnico = $8,
        clave_dispositivo_serviciotecnico = $9,
        costo_serviciotecnico = $10,
        abono_serviciotecnico = $11,
        garantia_aplica_serviciotecnico = $12,
        fecha_garantia_serviciotecnico = $13,
        numero_contacto_alternativo_servicio = $14,
        autorizado_serviciotecnico = $15
      WHERE id_serviciotecnico = $16
      RETURNING *`,
      [
        id_sede,
        id_proveedor || "PROV_TEMP_123",
        id_cliente,
        nombre_servicio,
        descripcion_servicio,
        fecha_servicio,
        fecha_entrega || null,
        tipo_dano || null,
        clave_dispositivo || null,
        costo,
        abono || 0,
        garantia_aplica || false,
        fecha_garantia || null,
        numero_contacto_alternativo || null,
        autorizado || false,
        id,
      ]
    );

    if (updateResult.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Servicio técnico no encontrado" });
    }

    await client.query("COMMIT");

    res.json({
      message: "Servicio técnico actualizado exitosamente",
      servicioTecnico: updateResult.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error al actualizar servicio técnico:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  } finally {
    client.release();
  }
};

// Obtener un servicio técnico específico por ID
export const getServicioTecnicoById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ error: "Se requiere el ID del servicio técnico" });
    }

    const result = await pool.query(
      `
      SELECT 
        st.id_serviciotecnico,
        st.id_sede_serviciotecnico,
        st.id_proveedor_serviciotecnico,
        st.id_cliente_serviciotecnico,
        st.id_factura_serviciotecnico,
        st.nombre_serviciotecnico,
        st.descripcion_serviciotecnico,
        st.fecha_serviciotecnico,
        st.fecha_entrega_serviciotecnico,
        st.tipo_dano_serviciotecnico,
        st.clave_dispositivo_serviciotecnico,
        st.costo_serviciotecnico,
        st.abono_serviciotecnico,
        st.garantia_aplica_serviciotecnico,
        st.fecha_garantia_serviciotecnico,
        st.numero_contacto_alternativo_servicio,
        st.autorizado_serviciotecnico,
        st.estadotecnico_serviciotecnico,
        st.estado_serviciotecnico,
        -- Datos relacionados
        COALESCE(cn.nombre_cliente, cj.razonsocial_cliente) AS nombre_cliente,
        pr.nombre_proveedor,
        fa.total_factura,
        fa.saldo_factura,
        fa.fecha_factura,
        se.nombre_sede
      FROM SERVICIOTECNICO st
      INNER JOIN CLIENTE cl ON cl.id_cliente = st.id_cliente_serviciotecnico
      LEFT JOIN CLIENTENATURAL cn ON cn.id_cliente = cl.id_cliente
      LEFT JOIN CLIENTEJURIDICO cj ON cj.id_cliente = cl.id_cliente
      LEFT JOIN PROVEEDOR pr ON pr.id_proveedor = st.id_proveedor_serviciotecnico
      INNER JOIN FACTURA fa ON fa.id_factura = st.id_factura_serviciotecnico
      INNER JOIN SEDE se ON se.id_sede = st.id_sede_serviciotecnico
      WHERE st.id_serviciotecnico = $1
    `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Servicio técnico no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener servicio técnico por ID:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
