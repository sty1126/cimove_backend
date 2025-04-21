import assert from "assert";
import express from "express";
import ordenesCompraRoutes from "../../routes/ordenesCompra.routes.js";

class OrdenesCompraRoutesTest {
  constructor() {
    this.app = express();
    this.routes = [];
  }

  setupApp() {
    this.app.use("/", ordenesCompraRoutes);
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
    console.log("🧪 Verificando rutas de órdenes de compra...");

    const expectedRoutes = [
      { path: "/", methods: ["get"] },                  // getOrdenesCompra
      { path: "/", methods: ["post"] },                 // createOrdenCompra
      { path: "/:id", methods: ["get"] },               // getOrdenCompraById
      { path: "/procesar-pedido", methods: ["post"] },  // procesarPedido
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
      console.log("✅ Todas las pruebas de rutas de órdenes de compra pasaron correctamente.");
    } catch (error) {
      console.error("❌ Error en pruebas de rutas de órdenes de compra:", error.message);
    }
  }
}

const test = new OrdenesCompraRoutesTest();
test.runAllTests();
