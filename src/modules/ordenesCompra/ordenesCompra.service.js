import { OrdenesCompraRepository } from "./ordenesCompra.repository.js";

export const OrdenesCompraService = {
  async listarOrdenes() {
    const result = await OrdenesCompraRepository.obtenerOrdenes();
    const ordenesMap = {};

    result.rows.forEach((row) => {
      const id = row.id_ordencompra;
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

    return Object.values(ordenesMap);
  },

  async crearOrden(data) {
    const result = await OrdenesCompraRepository.crearOrden(data);
    return result.rows[0];
  },

  async obtenerOrdenPorId(id) {
    const result = await OrdenesCompraRepository.obtenerOrdenPorId(id);
    return result.rows[0] || null;
  },

  async procesarPedido(productos) {
    const client = await OrdenesCompraRepository.crearConexion();
    try {
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
           VALUES ($1, $2, $3) RETURNING *`,
          [id_proveedor, fecha, total]
        );

        const orden = ordenRes.rows[0];

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
      return {
        mensaje: "Pedido procesado correctamente",
        ordenes: ordenesCreadas,
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },
  
    async eliminarOrdenCompra(id) {
    const result = await OrdenesCompraRepository.eliminarOrden(id);
    return result.rows[0] || null;
  }
};
