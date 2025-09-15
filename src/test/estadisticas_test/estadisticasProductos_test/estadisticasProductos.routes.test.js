import express from "express";
import productosRouter from "../../../modules/estadisticas/estadisticasProductos/estadisticasProductos.routes.js";

class ProductosRoutesTest {
  constructor() {
    this.app = express();
    this.routes = [];
  }

  async runAllTests() {
    console.log("📦 Iniciando test de estadisticasProductos.routes...\n");

    this.mountRouter();
    this.extractRoutes();

    this.assertRoute("GET", "/productos/bajo-stock");
    this.assertRoute("GET", "/productos/historico-ventas-producto");
    this.assertRoute("GET", "/productos/mas-vendidos");
    this.assertRoute("GET", "/productos/mas-vendidos-sede");

    console.log("\n✅ Todos los tests de estadisticasProductos.routes pasaron correctamente.");
  }

  mountRouter() {
    this.app.use("/productos", productosRouter);
  }

  extractRoutes() {
    const stack = this.app._router.stack;

    stack.forEach((middleware) => {
      if (middleware.route) {
        const path = middleware.route.path;
        const methods = middleware.route.methods;
        for (const method in methods) {
          if (methods[method]) {
            this.routes.push({ method: method.toUpperCase(), path });
          }
        }
      } else if (middleware.name === "router") {
        middleware.handle.stack.forEach((handler) => {
          const route = handler.route;
          if (route) {
            const path = route.path;
            const methods = route.methods;
            for (const method in methods) {
              if (methods[method]) {
                this.routes.push({
                  method: method.toUpperCase(),
                  path: `/productos${path}`,
                });
              }
            }
          }
        });
      }
    });
  }

  assertRoute(method, path) {
    const found = this.routes.find((r) => r.method === method && r.path === path);

    console.assert(found, `❌ Ruta ${method} ${path} no encontrada`);
    if (found) {
      console.log(`✅ Ruta ${method} ${path} existe`);
    }
  }
}

new ProductosRoutesTest().runAllTests().catch((err) =>
  console.error("❌ Error ejecutando los tests de rutas:", err)
);
