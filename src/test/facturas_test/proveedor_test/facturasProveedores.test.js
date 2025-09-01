import { pool } from '../../../db.js';
import {
  getFacturasProveedor,
  createFacturaProveedor,
  getProductosOrdenParaFactura,
  crearFacturaPersonalizada,
  generarFacturaDesdeOrden
} from '../../../modules/facturas/proveedor/facturasProveedores.controllers.js'; 

import assert from 'assert';

class FacturaProveedorTest {
  constructor() {
    this.originalQuery = pool.query;
    this.originalConnect = pool.connect;
  }

  mockResponse() {
    return {
      statusCode: 0,
      data: null,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        this.data = payload;
      }
    };
  }

  async testGetFacturasProveedor() {
    console.log('🧪 Test: getFacturasProveedor');

    const mockRows = [
      {
        id_facturaproveedor: 1,
        fecha_facturaproveedor: '2024-01-01',
        monto_facturaproveedor: 1000,
        total_abonado: 300,
        saldo_pendiente: 700,
        nombre_proveedor: 'Proveedor X',
        estado_facturaproveedor: 'A'
      }
    ];

    pool.query = async (sql) => {
      assert.ok(sql.includes('SELECT'), 'Debe ejecutar un SELECT');
      return { rows: mockRows };
    };

    const res = this.mockResponse();
    await getFacturasProveedor({}, res);
    assert.deepStrictEqual(res.data, mockRows);
    console.log('✅ OK');
  }

  async testCreateFacturaProveedor() {
    console.log('🧪 Test: createFacturaProveedor');

    const input = {
      body: {
        id_ordencompra: 1,
        fecha: '2024-01-01',
        monto: 1000
      }
    };

    const inserted = { id_facturaproveedor: 99, ...input.body };

    pool.query = async (sql, values) => {
      assert.ok(sql.includes('INSERT'), 'Debe insertar');
      assert.deepStrictEqual(values, [1, '2024-01-01', 1000]);
      return { rows: [inserted] };
    };

    const res = this.mockResponse();
    await createFacturaProveedor(input, res);
    assert.deepStrictEqual(res.data, inserted);
    assert.strictEqual(res.statusCode, 201);
    console.log('✅ OK');
  }

  async testGetProductosOrdenParaFactura() {
    console.log('🧪 Test: getProductosOrdenParaFactura');

    const req = { params: { id_ordencompra: 1 } };
    const mockRows = [
      { id_producto: 10, nombre_producto: 'Producto X', cantidad_ordenada: 5, preciounitario_detalleordencompra: 100 }
    ];

    pool.query = async (sql, values) => {
      assert.ok(sql.includes('FROM detalleordencompra'), 'Consulta incorrecta');
      assert.deepStrictEqual(values, [1]);
      return { rows: mockRows };
    };

    const res = this.mockResponse();
    await getProductosOrdenParaFactura(req, res);
    assert.deepStrictEqual(res.data, mockRows);
    console.log('✅ OK');
  }

  async testCrearFacturaPersonalizada() {
    console.log('🧪 Test: crearFacturaPersonalizada');

    const req = {
      body: {
        id_ordencompra: 1,
        productos: [
          { id_producto: 1, cantidad: 2, precio_unitario: 50 },
          { id_producto: 2, cantidad: 3, precio_unitario: 100 }
        ]
      }
    };

    let commitCalled = false;
    let inserts = [];

    pool.connect = async () => ({
      query: async (sql, values) => {
        if (sql.startsWith('BEGIN')) return;
        if (sql.startsWith('INSERT INTO facturaproveedor')) {
          return { rows: [{ id_facturaproveedor: 123 }] };
        }
        if (sql.startsWith('INSERT INTO detallefacturaproveedor')) {
          inserts.push(values);
          return;
        }
        if (sql.startsWith('COMMIT')) {
          commitCalled = true;
          return;
        }
      },
      release: () => {}
    });

    const res = this.mockResponse();
    await crearFacturaPersonalizada(req, res);

    assert.strictEqual(res.statusCode, 201);
    assert.strictEqual(commitCalled, true);
    assert.strictEqual(inserts.length, 2);
    console.log('✅ OK');
  }

  async testGenerarFacturaDesdeOrden() {
    console.log('🧪 Test: generarFacturaDesdeOrden');

    const req = {
      body: {
        id_ordencompra: 1
      }
    };

    const detalles = [
      {
        id_producto_detalleordencompra: 1,
        cantidad_detalleordencompra: 2,
        preciounitario_detalleordencompra: 100
      }
    ];

    let commitCalled = false;

    pool.connect = async () => ({
      query: async (sql, values) => {
        if (sql.startsWith('BEGIN')) return;
        if (sql.includes('FROM detalleordencompra')) {
          return { rows: detalles };
        }
        if (sql.includes('INSERT INTO facturaproveedor')) {
          return { rows: [{ id_facturaproveedor: 999 }] };
        }
        if (sql.includes('INSERT INTO detallefacturaproveedor')) return;
        if (sql.startsWith('COMMIT')) {
          commitCalled = true;
          return;
        }
      },
      release: () => {}
    });

    const res = this.mockResponse();
    await generarFacturaDesdeOrden(req, res);

    assert.strictEqual(res.statusCode, 201);
    assert.strictEqual(res.data.factura.id_facturaproveedor, 999);
    assert.strictEqual(commitCalled, true);
    console.log('✅ OK');
  }

  async run() {
    try {
      await this.testGetFacturasProveedor();
      await this.testCreateFacturaProveedor();
      await this.testGetProductosOrdenParaFactura();
      await this.testCrearFacturaPersonalizada();
      await this.testGenerarFacturaDesdeOrden();
      console.log('🎉 Todos los tests pasaron correctamente');
    } catch (error) {
      console.error('❌ Test falló:', error.message);
    } finally {
      pool.query = this.originalQuery;
      pool.connect = this.originalConnect;
    }
  }
}

const testSuite = new FacturaProveedorTest();
testSuite.run();
