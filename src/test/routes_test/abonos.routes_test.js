import express from "express";
import abonosRouter from "../../routes/abonos.routes.js";

class AbonosRoutesTest {
  constructor() {
    this.app = express();
    this.routes = [];
  }

  async runAllTests() {
    console.log("📦 Iniciando test de abonos.routes...\n");

    this.mountRouter();
    this.extractRoutes();

    this.assertRoute("GET", "/");
    this.assertRoute("POST", "/");
    this.assertRoute("GET", "/factura/:idFactura");
    this.assertRoute("DELETE", "/:id");
    this.assertRoute("GET", "/total/:idFactura");

    console.log("\n✅ Todos los tests de abonos.routes pasaron correctamente.");
  }

  mountRouter() {
    this.app.use("/abonos", abonosRouter);
  }

  extractRoutes() {
    const stack = this.app._router.stack;
    stack.forEach((middleware) => {
      if (middleware.route) {
        const path = middleware.route.path;
        const methods = middleware.route.methods;
        for (const method in methods) {
          if (methods[method]) {
            this.routes.push({
              method: method.toUpperCase(),
              path,
            });
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
                  path: `/abonos${path}`,
                });
              }
            }
          }
        });
      }
    });
  }

  assertRoute(method, path) {
    const fullPath = `/abonos${path}`;
    const found = this.routes.find(
      (r) => r.method === method && r.path === fullPath
    );

    console.assert(found, `❌ Ruta ${method} ${fullPath} no encontrada`);
    if (found) {
      console.log(`✅ Ruta ${method} ${fullPath} existe`);
    }
  }
}

new AbonosRoutesTest().runAllTests().catch((err) =>
  console.error("❌ Error ejecutando los tests de rutas:", err)
);
