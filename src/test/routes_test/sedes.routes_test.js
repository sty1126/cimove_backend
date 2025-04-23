import assert from "assert";
import express from "express";
import sedesRoutes from "../../routes/sedes.routes.js";

class SedesRoutesTest {
  constructor() {
    this.app = express();
    this.routes = [];
  }

  setupApp() {
    this.app.use("/", sedesRoutes);
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
    console.log("🧪 Verificando rutas de sedes...");

    const expectedRoutes = [
      { path: "/", methods: ["get"] },                           // getSedes
      { path: "/", methods: ["post"] },                          // createSede
      { path: "/:id_sede/desactivar", methods: ["put"] },        // deactivateSede
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
      console.log("✅ Todas las pruebas de rutas de sedes pasaron correctamente.");
    } catch (error) {
      console.error("❌ Error en pruebas de rutas de sedes:", error.message);
    }
  }
}

const test = new SedesRoutesTest();
test.runAllTests();
