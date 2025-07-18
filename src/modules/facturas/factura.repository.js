import { pool } from "../../db.js";

export const insertFactura = async (client, facturaData) => {
  const {
    fecha,
    idCliente,
    total,
    descuento,
    iva,
    subtotal,
    aplicaGarantia,
    fechaGarantia,
    saldo,
    idSede,
  } = facturaData;

  const fechaFactura = fecha || new Date();

  const result = await client.query(
    `INSERT INTO FACTURA (
      FECHA_FACTURA, ID_CLIENTE_FACTURA, TOTAL_FACTURA,
      DESCUENTO_FACTURA, IVA_FACTURA, SUBTOTAL_FACTURA,
      APLICAGARANTIA_FACTURA, FECHAGARANTIA_FACTURA, SALDO_FACTURA,
      ID_SEDE_FACTURA
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    RETURNING ID_FACTURA`,
    [
      fechaFactura,
      idCliente || null,
      total,
      descuento,
      iva,
      subtotal,
      aplicaGarantia,
      fechaGarantia || null,
      saldo,
      idSede || null,
    ]
  );
  return result.rows[0].id_factura;
};

export const insertDetalleFactura = async (client, idFactura, detalle) => {
  const { idProducto, cantidad, precioVenta, valorIVA } = detalle;

  await client.query(
    `INSERT INTO DETALLEFACTURA (
      ID_FACTURA_DETALLEFACTURA,
      ID_PRODUCTO_DETALLEFACTURA,
      CANTVENDIDA_DETALLEFACTURA,
      PRECIOVENTA_DETALLEFACTURA,
      VALORIVA_DETALLEFACTURA
    ) VALUES ($1,$2,$3,$4,$5)`,
    [idFactura, idProducto, cantidad, precioVenta, valorIVA]
  );
};

export const updateInventarioLocal = async (client, idProducto, idSede, cantidad) => {
  await client.query(
    `UPDATE INVENTARIOLOCAL
     SET EXISTENCIA_INVENTARIOLOCAL = EXISTENCIA_INVENTARIOLOCAL - $1
     WHERE ID_PRODUCTO_INVENTARIOLOCAL = $2 AND ID_SEDE_INVENTARIOLOCAL = $3`,
    [cantidad, idProducto, idSede]
  );
};

export const insertMetodoPago = async (client, idFactura, metodo) => {
  const { idTipoMetodoPago, monto } = metodo;

  await client.query(
    `INSERT INTO METODOPAGO (
      ID_FACTURA_METODOPAGO,
      ID_TIPOMETODOPAGO_METODOPAGO,
      MONTO_METODOPAGO
    ) VALUES ($1, $2, $3)`,
    [idFactura, idTipoMetodoPago, monto]
  );
};

export const fetchFacturas = async () => {
  const result = await pool.query(`
    SELECT
      f.ID_FACTURA,
      f.FECHA_FACTURA,
      f.TOTAL_FACTURA,
      f.SUBTOTAL_FACTURA,
      f.IVA_FACTURA,
      f.ESTADO_FACTURA,
      f.ID_CLIENTE_FACTURA,
      c.ID_CLIENTE,
      cn.NOMBRE_CLIENTE AS NOMBRE_NATURAL,
      cn.APELLIDO_CLIENTE,
      cj.RAZONSOCIAL_CLIENTE AS RAZON_JURIDICA,
      df.ID_DETALLEFACTURA,
      df.CANTVENDIDA_DETALLEFACTURA,
      df.PRECIOVENTA_DETALLEFACTURA,
      df.ID_PRODUCTO_DETALLEFACTURA,
      p.ID_PRODUCTO,
      p.NOMBRE_PRODUCTO,
      s.ID_SEDE,
      s.NOMBRE_SEDE
    FROM FACTURA f
    LEFT JOIN CLIENTE c ON f.ID_CLIENTE_FACTURA = c.ID_CLIENTE
    LEFT JOIN CLIENTENATURAL cn ON c.ID_CLIENTE = cn.ID_CLIENTE
    LEFT JOIN CLIENTEJURIDICO cj ON c.ID_CLIENTE = c.ID_CLIENTE
    LEFT JOIN DETALLEFACTURA df ON f.ID_FACTURA = df.ID_FACTURA_DETALLEFACTURA
    LEFT JOIN PRODUCTO p ON df.ID_PRODUCTO_DETALLEFACTURA = p.ID_PRODUCTO
    LEFT JOIN INVENTARIOLOCAL il ON df.ID_PRODUCTO_DETALLEFACTURA = il.ID_PRODUCTO_INVENTARIOLOCAL
    LEFT JOIN SEDE s ON il.ID_SEDE_INVENTARIOLOCAL = s.ID_SEDE
    WHERE f.ESTADO_FACTURA = 'A'
      AND df.ID_DETALLEFACTURA IS NOT NULL;
  `);
  return result.rows;
};

export const fetchMetodosPagoForFacturas = async () => {
  const result = await pool.query(`
    SELECT
      mp.ID_FACTURA_METODOPAGO,
      mp.MONTO_METODOPAGO,
      tmp.ID_TIPOMETODOPAGO,
      tmp.NOMBRE_TIPOMETODOPAGO
    FROM METODOPAGO mp
    JOIN TIPOMETODOPAGO tmp ON mp.ID_TIPOMETODOPAGO_METODOPAGO = tmp.ID_TIPOMETODOPAGO;
  `);
  return result.rows;
};

export const fetchFacturaById = async (idFactura) => {
  const result = await pool.query(
    `
    SELECT
      f.*,
      df.*,
      p.*
    FROM FACTURA f
    LEFT JOIN DETALLEFACTURA df ON f.ID_FACTURA = df.ID_FACTURA_DETALLEFACTURA
    LEFT JOIN PRODUCTO p ON df.ID_PRODUCTO_DETALLEFACTURA = p.ID_PRODUCTO
    WHERE f.ID_FACTURA = $1
  `,
    [idFactura]
  );
  return result.rows;
};