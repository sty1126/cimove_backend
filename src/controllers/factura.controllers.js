import { pool } from "../db.js";
export const createFactura = async (req, res) => {
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
    detalles, // [{ idProducto, cantidad, precioVenta, valorIVA, idSede }]
    metodosPago = [], // 🔹 <- Agregado aquí
  } = req.body;

  console.log("Datos recibidos:", req.body); // Imprime todo lo que llega en el body

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const fechaFactura = fecha || new Date();

    console.log("Fecha de factura:", fechaFactura);
    console.log("Cliente:", idCliente);
    console.log("Total:", total);
    console.log("Descuento:", descuento);
    console.log("IVA:", iva);
    console.log("Subtotal:", subtotal);
    console.log("Aplicar Garantía:", aplicaGarantia);
    console.log("Fecha Garantía:", fechaGarantia);
    console.log("Saldo:", saldo);
    console.log("Detalles:", detalles); // Imprime los detalles de la factura

    const resultFactura = await client.query(
      `INSERT INTO FACTURA (
        FECHA_FACTURA, ID_CLIENTE_FACTURA, TOTAL_FACTURA,
        DESCUENTO_FACTURA, IVA_FACTURA, SUBTOTAL_FACTURA,
        APLICAGARANTIA_FACTURA, FECHAGARANTIA_FACTURA, SALDO_FACTURA
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
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
      ]
    );

    const idFactura = resultFactura.rows[0].id_factura;

    console.log("ID de la factura registrada:", idFactura);

    // 🔸 Insertar detalles de la factura
    for (const item of detalles) {
      const { idProducto, cantidad, precioVenta, valorIVA, idSede } = item;

      console.log(`Detalles del producto:`, item); // Imprime cada detalle

      if (!idSede) {
        throw new Error(`Falta idSede para el producto ${idProducto}`);
      }

      await client.query(
        `INSERT INTO DETALLEFACTURA (
          ID_FACTURA_DETALLEFACTURA, ID_PRODUCTO_DETALLEFACTURA,
          CANTVENDIDA_DETALLEFACTURA, PRECIOVENTA_DETALLEFACTURA,
          VALORIVA_DETALLEFACTURA
        ) VALUES ($1,$2,$3,$4,$5)`,
        [idFactura, idProducto, cantidad, precioVenta, valorIVA]
      );

      await client.query(
        `UPDATE INVENTARIOLOCAL
         SET EXISTENCIA_INVENTARIOLOCAL = EXISTENCIA_INVENTARIOLOCAL - $1
         WHERE ID_PRODUCTO_INVENTARIOLOCAL = $2 AND ID_SEDE_INVENTARIOLOCAL = $3`,
        [cantidad, idProducto, idSede]
      );
    }

    // 🔹 Insertar métodos de pago
    for (const metodo of metodosPago) {
      const { idTipoMetodoPago, monto } = metodo;

      console.log(`Método de pago:`, metodo); // Imprime cada método de pago

      if (!idTipoMetodoPago || monto == null) {
        throw new Error("Método de pago inválido");
      }

      await client.query(
        `INSERT INTO METODOPAGO (
          ID_FACTURA_METODOPAGO,
          ID_TIPOMETODOPAGO_METODOPAGO,
          MONTO_METODOPAGO
        ) VALUES ($1, $2, $3)`,
        [idFactura, idTipoMetodoPago, monto]
      );
    }

    await client.query("COMMIT");

    res.status(201).json({
      message: "Factura registrada con éxito",
      idFactura,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error registrando factura:", error);
    res.status(500).json({ error: "Error registrando la factura" });
  } finally {
    client.release();
  }
};

export const getFacturas = async (req, res) => {
  try {
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
        p.NOMBRE_PRODUCTO

      FROM FACTURA f
      LEFT JOIN CLIENTE c ON f.ID_CLIENTE_FACTURA = c.ID_CLIENTE
      LEFT JOIN CLIENTENATURAL cn ON c.ID_CLIENTE = cn.ID_CLIENTE
      LEFT JOIN CLIENTEJURIDICO cj ON c.ID_CLIENTE = cj.ID_CLIENTE
      LEFT JOIN DETALLEFACTURA df ON f.ID_FACTURA = df.ID_FACTURA_DETALLEFACTURA
      LEFT JOIN PRODUCTO p ON df.ID_PRODUCTO_DETALLEFACTURA = p.ID_PRODUCTO
      WHERE f.ESTADO_FACTURA = 'A'
        AND df.ID_DETALLEFACTURA IS NOT NULL;
    `);

    // 🔹 Obtener los métodos de pago por separado
    const metodosPagoResult = await pool.query(`
      SELECT 
        mp.ID_FACTURA_METODOPAGO,
        mp.MONTO_METODOPAGO,
        tmp.ID_TIPOMETODOPAGO,
        tmp.NOMBRE_TIPOMETODOPAGO
      FROM METODOPAGO mp
      JOIN TIPOMETODOPAGO tmp ON mp.ID_TIPOMETODOPAGO_METODOPAGO = tmp.ID_TIPOMETODOPAGO;
    `);

    // 🔹 Agrupar métodos de pago por factura
    const metodosPagoMap = new Map();
    for (const mp of metodosPagoResult.rows) {
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

    // 🔹 Armar resultado final
    const facturasMap = new Map();
    for (const row of result.rows) {
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
        });
      }
    }

    const facturas = Array.from(facturasMap.values());
    res.json(facturas);
  } catch (error) {
    console.error("Error obteniendo facturas:", error);
    res.status(500).json({ error: "Error al listar las facturas" });
  }
};

export const getFacturaById = async (req, res) => {
  const { idFactura } = req.params;

  try {
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

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Factura no encontrada" });
    }

    res.json(result.rows);
  } catch (error) {
    console.error("Error obteniendo factura por ID:", error);
    res.status(500).json({ error: "Error al obtener la factura" });
  }
};
