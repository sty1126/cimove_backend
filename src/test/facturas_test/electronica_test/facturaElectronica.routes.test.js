import assert from "assert";
import express, { Router } from "express";
import router from "../../../modules/facturas/electronica/facturaElectronica.routes.js"; 

class FacturaElectronicaRoutesTest {
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
    console.log("🧪 Verificando rutas de facturas electrónicas...");

    const expectedRoutes = [
      { path: "/", methods: ["get"] },
      { path: "/:id", methods: ["get"] },
      { path: "/", methods: ["post"] },
      { path: "/:id", methods: ["put"] },
      { path: "/actualizar/:id", methods: ["put"] },
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
      console.log("✅ Todas las pruebas de rutas de facturas electrónicas pasaron correctamente.");
    } catch (error) {
      console.error("❌ Error en pruebas de rutas de facturas electrónicas:", error.message);
    }
  }
}

const test = new FacturaElectronicaRoutesTest();
test.runAllTests();