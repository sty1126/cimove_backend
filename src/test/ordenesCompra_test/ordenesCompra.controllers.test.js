import { pool } from '../../db.js';
import {
  getOrdenesCompra,
  createOrdenCompra,
  getOrdenCompraById,
  procesarPedidoCarrito,
} from '../../modules/ordenesCompra/ordenesCompra.controllers.js';

class OrdenCompraTest {
  async runAllTests() {
    console.log("🧪 Iniciando tests de OrdenCompra...\n");
    await this.testGetOrdenesCompra();
    await this.testCreateOrdenCompra();
    await this.testGetOrdenCompraById();
    await this.testProcesarPedidoCarrito();
    console.log("\n✅ Todos los tests finalizados correctamente.");
  }

  async testGetOrdenesCompra() {
    console.log("🔍 Test: getOrdenesCompra");
    pool.query = async () => ({
      rows: [
        {
          id_ordencompra: 1,
          fecha_ordencompra: "2025-04-18",
          total_ordencompra: 500,
          estado_facturaproveedor: "A",
          id_proveedor: 10,
          nombre_proveedor: "Proveedor A",
          id_detalleordencompra: 101,
          id_producto_detalleordencompra: 201,
          nombre_producto: "Producto A",
          cantidad_detalleordencompra: 2,
          preciounitario_detalleordencompra: 100,
          subtotal_detalleordencompra: 200,
        },
      ],
    });

    const res = this.createMockRes();
    await getOrdenesCompra({}, res);
    console.assert(res.statusCode === 200, "getOrdenesCompra debe devolver status 200");
    console.assert(Array.isArray(res.data), "getOrdenesCompra debe devolver un array");
    console.assert(res.data.length === 1, "Debe haber una orden");

    console.log("✅ getOrdenesCompra pasó el test\n");
  }

  async testCreateOrdenCompra() {
    console.log("📝 Test: createOrdenCompra");
    pool.query = async (sql, params) => {
      if (sql.includes("INSERT INTO ordencompra")) {
        return {
          rows: [
            {
              id_ordencompra: 999,
              id_proveedor_ordencompra: params[0],
              fecha_ordencompra: params[1],
              total_ordencompra: params[2],
            },
          ],
        };
      }
      return { rows: [] };
    };

    const mockReq = {
      body: {
        id_proveedor: 1,
        fecha: "2025-04-18",
        total: 500,
      },
    };

    const res = this.createMockRes();
    await createOrdenCompra(mockReq, res);

    console.assert(res.statusCode === 201, "createOrdenCompra debe devolver status 201");
    console.assert(res.data.id_ordencompra === 999, "Debe devolver la orden creada");

    console.log("✅ createOrdenCompra pasó el test\n");
  }

  async testGetOrdenCompraById() {
    console.log("📄 Test: getOrdenCompraById");
    pool.query = async () => ({
      rows: [
        {
          id_ordencompra: 1,
          id_proveedor_ordencompra: 2,
          nombre_proveedor: "Proveedor A",
          estado_facturaproveedor: "A",
        },
      ],
    });

    const mockReq = { params: { id: 1 } };

    const res = this.createMockRes();
    await getOrdenCompraById(mockReq, res);

    console.assert(res.statusCode === 200, "getOrdenCompraById debe devolver status 200");
    console.assert(res.data.id_ordencompra === 1, "Debe devolver la orden correcta");

    console.log("✅ getOrdenCompraById pasó el test\n");
  }

  async testProcesarPedidoCarrito() {
    console.log("📦 Test: procesarPedidoCarrito");
    pool.connect = async () => ({
      query: async (sql, params) => {
        if (sql.includes("SELECT costoventa_producto")) {
          return { rows: [{ costoventa_producto: 100 }] };
        }
        if (sql.includes("INSERT INTO ordencompra")) {
          return {
            rows: [
              {
                id_ordencompra: 123,
                id_proveedor_ordencompra: params[0],
                fecha_ordencompra: params[1],
                total_ordencompra: params[2],
              },
            ],
          };
        }
        if (sql.includes("INSERT INTO detalleordencompra")) {
          return { rows: [] };
        }
        return { rows: [] };
      },
      release: () => {},
    });

    const mockReq = {
      body: {
        productos: [
          {
            id_producto: 1,
            proveedores: [
              {
                id_proveedor: 10,
                cantidad: 2,
              },
            ],
          },
        ],
      },
    };

    const res = this.createMockRes();
    await procesarPedidoCarrito(mockReq, res);

    console.assert(res.statusCode === 201, "procesarPedidoCarrito debe devolver status 201");
    console.assert(Array.isArray(res.data.ordenes), "Debe devolver arreglo de órdenes");
    console.assert(res.data.ordenes.length === 1, "Debe procesar una orden");

    console.log("✅ procesarPedidoCarrito pasó el test\n");
  }

  createMockRes() {
    return {
      data: null,
      statusCode: 0,
      json(data) {
        this.data = data;
        this.statusCode = this.statusCode || 200;
      },
      status(code) {
        this.statusCode = code;
        return this;
      },
    };
  }
}

new OrdenCompraTest().runAllTests().catch((e) => {
  console.error("❌ Error ejecutando los tests:", e);
});
