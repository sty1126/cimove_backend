import assert from "assert";
import express from "express";
import proveedorProductoRoutes from "../../routes/proveedorProducto.routes.js";

class ProveedorProductoRoutesTest {
  constructor() {
    this.app = express();
    this.routes = [];
  }

  setupApp() {
    this.app.use("/", proveedorProductoRoutes);
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
    console.log("🧪 Verificando rutas de proveedor-producto...");

    const expectedRoutes = [
      { path: "/", methods: ["get"] },                                 // getProveedoresByMultipleProductos
      { path: "/:id_producto", methods: ["get"] },                     // getProveedoresByProducto
      { path: "/", methods: ["post"] },                                // asociarProveedorAProducto
      { path: "/:id_proveedorproducto", methods: ["delete"] },         // desasociarProveedorDeProducto
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
      console.log("✅ Todas las pruebas de rutas de proveedor-producto pasaron correctamente.");
    } catch (error) {
      console.error("❌ Error en pruebas de rutas de proveedor-producto:", error.message);
    }
  }
}

const test = new ProveedorProductoRoutesTest();
test.runAllTests();
