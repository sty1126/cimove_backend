import { pool } from "../db.js";

export const getOrdenesCompra = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        o.id_ordencompra,
        o.fecha_ordencompra,
        o.total_ordencompra,
        o.estado_facturaproveedor,
        p.id_proveedor,
        p.nombre_proveedor,
        d.id_detalleordencompra,
        d.id_producto_detalleordencompra,
        prod.nombre_producto,
        d.cantidad_detalleordencompra,
        d.preciounitario_detalleordencompra,
        d.subtotal_detalleordencompra 
      FROM ORDENCOMPRA o
      JOIN PROVEEDOR p ON o.id_proveedor_ordencompra = p.id_proveedor
      LEFT JOIN DETALLEORDENCOMPRA d ON o.id_ordencompra = d.id_ordencompra_detalleordencompra
      LEFT JOIN PRODUCTO prod ON d.id_producto_detalleordencompra = prod.id_producto
      WHERE o.estado_facturaproveedor = 'A' AND p.estado_proveedor = 'A'
      ORDER BY o.fecha_ordencompra DESC
    `);

    // Mapa para agrupar las órdenes de compra por ID
    const ordenesMap = {};

    result.rows.forEach((row) => {
      const id = row.id_ordencompra;

      // Si no existe la orden en el mapa, la creamos
      if (!ordenesMap[id]) {
        ordenesMap[id] = {
          id_ordencompra: id,
          fecha_ordencompra: row.fecha_ordencompra,
          total_ordencompra: row.total_ordencompra,
          estado_facturaproveedor: row.estado_facturaproveedor,
          id_proveedor: row.id_proveedor,
          nombre_proveedor: row.nombre_proveedor,
          detalles: [],
        };
      }

      // Si existen detalles de orden, los agregamos a la orden correspondiente
      if (row.id_detalleordencompra) {
        ordenesMap[id].detalles.push({
          id_detalleordencompra: row.id_detalleordencompra,
          id_producto: row.id_producto_detalleordencompra,
          nombre_producto: row.nombre_producto,
          cantidad: row.cantidad_detalleordencompra,
          precio_unitario: row.preciounitario_detalleordencompra,
          subtotal: row.subtotal_detalleordencompra,
        });
      }
    });

    // Devolvemos los valores del mapa como un array
    res.json(Object.values(ordenesMap));
  } catch (error) {
    console.error("Error al obtener órdenes de compra:", error);
    res.status(500).json({ error: "Error al obtener órdenes de compra" });
  }
};

// Crear una nueva orden de compra
export const createOrdenCompra = async (req, res) => {
  try {
    const { id_proveedor, fecha, total } = req.body;
    const result = await pool.query(
      `INSERT INTO ordencompra (id_ordencompra, id_proveedor_ordencompra, fecha_ordencompra, total_ordencompra)
       VALUES (DEFAULT, $1, $2, $3) RETURNING *`,
      [id_proveedor, fecha, total]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al crear orden de compra:", error);
    res.status(500).json({ error: "Error al crear orden de compra" });
  }
};

// Obtener una orden de compra por ID
export const getOrdenCompraById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `
      SELECT oc.*, p.nombre_proveedor
      FROM ordencompra oc
      JOIN proveedor p ON oc.id_proveedor_ordencompra = p.id_proveedor
      WHERE oc.id_ordencompra = $1 AND oc.estado_facturaproveedor = 'A'
    `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Orden de compra no encontrada" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener orden de compra:", error);
    res.status(500).json({ error: "Error al obtener orden de compra" });
  }
};

export const procesarPedidoCarrito = async (req, res) => {
  const client = await pool.connect();
  try {
    const { productos } = req.body;
    const fecha = new Date();

    const pedidosPorProveedor = {};

    productos.forEach((prod) => {
      prod.proveedores.forEach((prov) => {
        if (!pedidosPorProveedor[prov.id_proveedor]) {
          pedidosPorProveedor[prov.id_proveedor] = [];
        }
        pedidosPorProveedor[prov.id_proveedor].push({
          id_producto: prod.id_producto,
          cantidad: prov.cantidad,
        });
      });
    });

    await client.query("BEGIN");

    const ordenesCreadas = [];

    for (const id_proveedor in pedidosPorProveedor) {
      const detalles = pedidosPorProveedor[id_proveedor];

      let total = 0;
      for (const d of detalles) {
        const precioRes = await client.query(
          `SELECT costoventa_producto FROM producto WHERE id_producto = $1`,
          [d.id_producto]
        );
        const precio = precioRes.rows[0].costoventa_producto;
        d.precio_unitario = precio;
        d.subtotal = precio * d.cantidad;
        total += d.subtotal;
      }

      const ordenRes = await client.query(
        `INSERT INTO ordencompra (id_proveedor_ordencompra, fecha_ordencompra, total_ordencompra)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [id_proveedor, fecha, total]
      );

      const orden = ordenRes.rows[0];

      // Insertar DETALLEORDENCOMPRA
      for (const d of detalles) {
        await client.query(
          `INSERT INTO detalleordencompra
           (id_ordencompra_detalleordencompra, id_producto_detalleordencompra, cantidad_detalleordencompra, preciounitario_detalleordencompra, subtotal_detalleordencompra)
           VALUES ($1, $2, $3, $4, $5)`,
          [
            orden.id_ordencompra,
            d.id_producto,
            d.cantidad,
            d.precio_unitario,
            d.subtotal,
          ]
        );
      }

      ordenesCreadas.push(orden);
    }

    await client.query("COMMIT");

    res.status(201).json({
      mensaje: "Pedido procesado correctamente",
      ordenes: ordenesCreadas,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error al procesar pedido:", error);
    res.status(500).json({ error: "Error al procesar el pedido" });
  } finally {
    client.release();
  }
};
