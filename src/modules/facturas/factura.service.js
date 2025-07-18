import { pool } from "../../db.js"; 
import * as facturaRepo from "./factura.repository.js";

export const createFactura = async (facturaData) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Insertar Factura
    const idFactura = await facturaRepo.insertFactura(client, facturaData);

    // Insertar Detalles y actualizar InventarioLocal
    for (const item of facturaData.detalles) {
      if (!item.idSede) {
        throw new Error(`Falta idSede para el producto ${item.idProducto}`);
      }
      await facturaRepo.insertDetalleFactura(client, idFactura, item);
      await facturaRepo.updateInventarioLocal(client, item.idProducto, item.idSede, item.cantidad);
    }

    // Insertar Metodos de Pago
    for (const metodo of facturaData.metodosPago || []) {
      if (!metodo.idTipoMetodoPago || metodo.monto == null) {
        throw new Error("Método de pago inválido");
      }
      await facturaRepo.insertMetodoPago(client, idFactura, metodo);
    }

    await client.query("COMMIT");
    return { message: "Factura registrada con éxito", idFactura };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error; 
  } finally {
    client.release();
  }
};

export const getFacturas = async () => {
  const rawFacturas = await facturaRepo.fetchFacturas();
  const rawMetodosPago = await facturaRepo.fetchMetodosPagoForFacturas();

  const metodosPagoMap = new Map();
  for (const mp of rawMetodosPago) {
    const idFactura = mp.id_factura_metodopago;
    if (!metodosPagoMap.has(idFactura)) {
      metodosPagoMap.set(idFactura, []);
    }
    metodosPagoMap.get(idFactura).push({
      id_tipo_metodo_pago: mp.id_tipometodopago,
      nombre_tipo_metodo_pago: mp.nombre_tipometodopago,
      monto: mp.monto_metodopago,
    });
  }

  const facturasMap = new Map();
  for (const row of rawFacturas) {
    const idFactura = row.id_factura;

    if (!facturasMap.has(idFactura)) {
      let nombreCliente = null;

      if (row.razon_juridica) {
        nombreCliente = row.razon_juridica;
      } else if (row.nombre_natural && row.apellido_cliente) {
        nombreCliente = `${row.nombre_natural} ${row.apellido_cliente}`;
      }

      facturasMap.set(idFactura, {
        id_factura: row.id_factura,
        fecha_factura: row.fecha_factura,
        total_factura: row.total_factura,
        subtotal_factura: row.subtotal_factura,
        iva_factura: row.iva_factura,
        estado_factura: row.estado_factura,
        cliente: row.id_cliente
          ? {
              id_cliente: row.id_cliente,
              nombre_cliente: nombreCliente,
            }
          : null,
        detalles: [],
        metodos_pago: metodosPagoMap.get(idFactura) || [],
      });
    }

    if (row.id_detallefactura) {
      facturasMap.get(idFactura).detalles.push({
        id_detallefactura: row.id_detallefactura,
        cantidad: row.cantvendida_detallefactura,
        precio_unitario: row.precioventa_detallefactura,
        producto: row.id_producto
          ? {
              id_producto: row.id_producto,
              nombre_producto: row.nombre_producto,
            }
          : null,
        sede: row.id_sede
          ? {
              id_sede: row.id_sede,
              nombre_sede: row.nombre_sede,
            }
          : null,
      });
    }
  }

  return Array.from(facturasMap.values());
};

export const getFacturaById = async (idFactura) => {
  const result = await facturaRepo.fetchFacturaById(idFactura);
  return result;
};