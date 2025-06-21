import assert from "assert";
import express from "express";
import router from "../../routes/estadisticas.routes.js"; 

class EstadisticasRoutesTest {
  constructor() {
    this.app = express();
    this.routes = [];
  }

  setupApp() {
    this.app.use("/", router);
    this.routes = this.getRoutes(this.app);
  }

  getRoutes(app) {
    const routes = [];
    app._router.stack.forEach((middleware) => {
      if (middleware.name === "router" && middleware.handle.stack) {
        middleware.handle.stack.forEach((handler) => {
          if (handler.route) {
            routes.push({
              path: handler.route.path,
              methods: Object.keys(handler.route.methods),
            });
          }
        });
      }
    });
    return routes;
  }

  testRoutesStructure() {
    console.log("🧪 Verificando rutas de estadísticas...");

    const expectedRoutes = [
      { path: "/top-productos/cantidad", methods: ["get"] },
      { path: "/top-productos/valor", methods: ["get"] },
      { path: "/productos-frecuentes", methods: ["get"] },
      { path: "/stock-vs-ventas", methods: ["get"] },
      { path: "/productos-bajo-stock-alta-demanda", methods: ["get"] },
      { path: "/productos-obsoletos", methods: ["get"] },
      { path: "/top-clientes/monto", methods: ["get"] },
      { path: "/top-clientes/cantidad", methods: ["get"] },
      { path: "/top-clientes/frecuencia", methods: ["get"] },
      { path: "/clientes-frecuentes-vs-esporadicos", methods: ["get"] },
      { path: "/clientes-pagos-pendientes", methods: ["get"] },
      { path: "/ingresos/dia", methods: ["get"] },
      { path: "/ingresos/mes", methods: ["get"] },
      { path: "/ingresos/ano", methods: ["get"] },
      { path: "/ingresos/total", methods: ["get"] },
      { path: "/ingresos/reales", methods: ["get"] },
      { path: "/ingresos/metodo-pago", methods: ["get"] },
      { path: "/ingresos/sede", methods: ["get"] },
      { path: "/ingresos/sedeanio", methods: ["get"] },
      { path: "/ingresos/sedemes", methods: ["get"] },
      { path: "/ingresos/sededia", methods: ["get"] },
      { path: "/pagos-proveedores/totales", methods: ["get"] },
      { path: "/pagos-proveedores/por-proveedor", methods: ["get"] },
      { path: "/pagos-proveedores/por-mes", methods: ["get"] },
      { path: "/nomina/por-sede-rol", methods: ["get"] },
    ];

    expectedRoutes.forEach((expected) => {
      const match = this.routes.find(
        (r) =>
          r.path === expected.path &&
          expected.methods.every((m) => r.methods.includes(m))
      );
      assert.ok(
        match,
        `❌ Ruta ${expected.methods.join(",").toUpperCase()} ${expected.path} no está bien definida`
      );
      console.log(`✅ Ruta ${expected.methods.join(",").toUpperCase()} ${expected.path} OK`);
    });
  }

  runAllTests() {
    try {
      this.setupApp();
      this.testRoutesStructure();
      console.log("✅ Todas las pruebas de rutas de estadísticas pasaron correctamente.");
    } catch (error) {
      console.error("❌ Error en pruebas de rutas de estadísticas:", error.message);
    }
  }
}

const test = new EstadisticasRoutesTest();
test.runAllTests();