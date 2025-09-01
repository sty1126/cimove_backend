import assert from "assert";
import express from "express";
import inventarioLocalRoutes from "../../../modules/inventario/inventarioLocal/inventariolocal.routes.js";

class InventarioLocalRoutesTest {
  constructor() {
    this.app = express();
    this.routes = [];
  }

  setupApp() {
    this.app.use("/", inventarioLocalRoutes);
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
    console.log("🧪 Verificando rutas de inventario local...");

    const expectedRoutes = [
      { path: "/", methods: ["get"] },
      { path: "/sede/:sedeId", methods: ["get"] },
      { path: "/existe/:idProducto/:idSede", methods: ["get"] },
      { path: "/", methods: ["post"] },
      { path: "/:inventariolocalId", methods: ["put"] },
      { path: "/:idProducto/:idSede/ajustar", methods: ["patch"] },
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
      console.log("✅ Todas las pruebas de rutas de inventario local pasaron correctamente.");
    } catch (error) {
      console.error("❌ Error en pruebas de rutas de inventario local:", error.message);
    }
  }
}

const test = new InventarioLocalRoutesTest();
test.runAllTests();
