import assert from "assert";
import express from "express";
import productosRoutes from "../../routes/productos.routes.js";

class ProductosRoutesTest {
  constructor() {
    this.app = express();
    this.routes = [];
  }

  setupApp() {
    this.app.use("/", productosRoutes);
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
    console.log("🧪 Verificando rutas de productos...");

    const expectedRoutes = [
      { path: "/", methods: ["get"] },                            // getProductos
      { path: "/detalle/:productoId", methods: ["get"] },         // getProductoDetalle
      { path: "/detalles", methods: ["get"] },                    // getProductosDetalles
      { path: "/:productoId", methods: ["get"] },                 // getProducto
      { path: "/", methods: ["post"] },                           // createProducto
      { path: "/:productoId", methods: ["put"] },                 // putProducto
      { path: "/eliminar/:id", methods: ["put"] },                // deleteProducto
      { path: "/:productoId/proveedores", methods: ["get"] },     // getProveedoresPorProducto
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
      console.log("✅ Todas las pruebas de rutas de productos pasaron correctamente.");
    } catch (error) {
      console.error("❌ Error en pruebas de rutas de productos:", error.message);
    }
  }
}

const test = new ProductosRoutesTest();
test.runAllTests();
