import { pool } from "../../db.js";

// Mock de respuesta
function mockResponse() {
    const res = {};
    res.statusCode = 200;
    res.data = null;
    res.status = function (code) {
        this.statusCode = code;
        return this;
    };
    res.json = function (data) {
        this.data = data;
        return this;
    };
    return res;
}

// Mocks para los datos de prueba
const facturasMock = {
    rows: [
        {
            id_factura: '1',
            fecha_factura: '2024-05-05T00:00:00.000Z',
            id_cliente_factura: '101',
            total_factura: 100,
            descuento_factura: 0,
            iva_factura: 20,
            subtotal_factura: 80,
            aplicagarantia_factura: true,
            fechagarantia_factura: '2024-05-12T00:00:00.000Z',
            saldo_factura: 100,
            id_detallefactura: '1',
            id_producto_detallefactura: '201',
            cantvendida_detallefactura: 2,
            precioventa_detallefactura: 50,
            valoriva_detallefactura: 10,
            id_producto: '201',
            nombre_producto: 'Producto A'
        }
    ]
};

const metodosPagoMock = {
    rows: [
        {
            id_metodopago: '1',
            id_factura_metodopago: '1',
            id_tipometodopago_metodopago: '301',
            monto_metodopago: 100,
            estado_metodopago: 'A'
        }
    ]
};

//Importar el controlador después de mockear el pool
import * as facturasController from "../../controllers/factura.controllers.js";

// Prueba 1: createFactura
async function testCreateFactura() {
    console.log("🔍 Test: createFactura");

    const mockClient = {
        query: async (sql, params) => {
            if (sql.includes("INSERT INTO FACTURA")) return { rows: [{ id_factura: '123' }] };
            if (sql.includes("INSERT INTO DETALLEFACTURA")) return { rows: [] };
            if (sql.includes("UPDATE INVENTARIOLOCAL")) return { rows: [] };
            if (sql.includes("INSERT INTO METODOPAGO")) return { rows: [] };
            return { rows: [] };
        },
        release: async () => { },
    };

    pool.connect = async () => Promise.resolve(mockClient);


    const req = {
        body: {
            fecha: '2024-05-05',
            idCliente: '101',
            total: 100,
            descuento: 0,
            iva: 20,
            subtotal: 80,
            aplicaGarantia: true,
            fechaGarantia: '2024-05-12',
            saldo: 100,
            detalles: [{ idProducto: '201', cantidad: 2, precioVenta: 50, valorIVA: 10, idSede: '301' }],
            metodosPago: [{ idTipoMetodoPago: '301', monto: 100 }]
        }
    };
    const res = mockResponse();

    try {
        await facturasController.createFactura(req, res);

        console.assert(res.statusCode === 201, "❌ Código incorrecto");
        console.assert(res.data.idFactura === '123', "❌ ID Factura incorrecto");
        console.log("✅ createFactura pasó la prueba\n");
    } catch (error) {
        console.error("Error en testCreateFactura:", error);
    }
}

// Prueba 2: getFacturas
async function testGetFacturas() {
    console.log("🔍 Test: getFacturas");

    pool.query = async (sql) => {
        if (sql.includes("FROM FACTURA f") && sql.includes("WHERE f.ESTADO_FACTURA = 'A'")) {
            return { rows: facturasMock.rows };
        }
        if (sql.includes("FROM METODOPAGO mp") && sql.includes("JOIN TIPOMETODOPAGO tmp")) {
            return { rows: metodosPagoMock.rows };
        }
        return { rows: [] };
    };

    const req = {};
    const res = mockResponse();

    await facturasController.getFacturas(req, res);

    console.assert(res.statusCode === 200, "❌ Código incorrecto");
    console.assert(Array.isArray(res.data), "❌ No devolvió un array");
    console.assert(res.data.length === 1, "❌ No se obtuvieron facturas");
    console.assert(res.data[0].total_factura === 100, "❌ Total incorrecto");
    console.log("✅ getFacturas pasó la prueba\n");
}

// Prueba 3: getFacturaById
async function testGetFacturaById() {
    console.log("🔍 Test: getFacturaById");

    pool.query = async () => ({ rows: facturasMock.rows });

    const req = { params: { idFactura: '1' } };
    const res = mockResponse();

    await facturasController.getFacturaById(req, res);

    console.assert(res.statusCode === 200, "❌ Código incorrecto");
    console.assert(Array.isArray(res.data), "❌ No devolvió un array");
    console.assert(res.data.length === 1, "❌ No se obtuvo la factura");
    console.assert(res.data[0].id_factura === '1', "❌ ID Factura incorrecto");
    console.log("✅ getFacturaById pasó la prueba\n");
}

//Ejecutar las pruebas
(async function runTests() {
    await testCreateFactura();
    await testGetFacturas();
    await testGetFacturaById();
})();