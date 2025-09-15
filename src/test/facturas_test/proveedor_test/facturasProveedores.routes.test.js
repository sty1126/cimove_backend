import assert from "assert";
import express from "express";
import facturasRoutes from "../../../modules/facturas/proveedor/facturasProveedores.routes.js";

class FacturasProveedoresRoutesTest {
  constructor() {
    this.app = express();
    this.routes = [];
  }

  setupApp() {
    this.app.use("/facturas", facturasRoutes); // 🔧 Usa el prefijo correcto
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
    console.log("🧪 Verificando rutas de facturas proveedores...");

    const expectedRoutes = [
      { path: "/", methods: ["get"] },
      { path: "/", methods: ["post"] },
      { path: "/:id", methods: ["get"] },
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
      console.log("✅ Todas las pruebas de rutas de facturas proveedores pasaron correctamente.");
    } catch (error) {
      console.error("❌ Error en pruebas de rutas de facturas proveedores:", error.message);
    }
  }
}

const test = new FacturasProveedoresRoutesTest();
test.runAllTests();

