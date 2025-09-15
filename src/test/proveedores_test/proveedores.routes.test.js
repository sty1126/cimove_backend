import assert from "assert";
import express from "express";
import proveedoresRoutes from "../../modules/proveedores/proveedores.routes.js";

class ProveedoresRoutesTest {
  constructor() {
    this.app = express();
    this.routes = [];
  }

  setupApp() {
    this.app.use("/", proveedoresRoutes);
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
    console.log("🧪 Verificando rutas de proveedores...");

    const expectedRoutes = [
      { path: "/tipos", methods: ["get"] },                       // getTiposProveedores
      { path: "/all", methods: ["get"] },                         // getProveedores
      { path: "/:id", methods: ["get"] },                         // getProveedorById
      { path: "/", methods: ["post"] },                           // createProveedor
      { path: "/:id", methods: ["put"] },                         // updateProveedor
      { path: "/eliminar/:id", methods: ["put"] },                // deleteProveedor
      { path: "/tipos", methods: ["get"] },           // getTiposProveedores
      { path: "/tipos", methods: ["post"] },          // createTipoProveedor
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
      console.log("✅ Todas las pruebas de rutas de proveedores pasaron correctamente.");
    } catch (error) {
      console.error("❌ Error en pruebas de rutas de proveedores:", error.message);
    }
  }
}

const test = new ProveedoresRoutesTest();
test.runAllTests();
