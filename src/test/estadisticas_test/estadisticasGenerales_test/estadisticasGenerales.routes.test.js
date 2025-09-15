import express from "express";
import estadisticasGeneralesRouter from "../../../modules/estadisticas/estadisticasGenerales/estadisticasGenerales.routes.js"; 

class EstadisticasGeneralesRoutesTest {
  constructor() {
    this.app = express();
    this.routes = [];
  }

  async runAllTests() {
    console.log("📦 Iniciando test de estadisticasGenerales.routes...\n");

    this.mountRouter();
    this.extractRoutes();

    this.assertRoute("GET", "/rentabilidad");
    this.assertRoute("GET", "/rentabilidad-evolucion");

    console.log("\n✅ Todos los tests de estadisticasGenerales.routes pasaron correctamente.");
  }

  mountRouter() {
    this.app.use("/estadisticas", estadisticasGeneralesRouter);
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
                  path: `/estadisticas${path}`,
                });
              }
            }
          }
        });
      }
    });
  }

  assertRoute(method, path) {
    const fullPath = `/estadisticas${path}`;
    const found = this.routes.find(
      (r) => r.method === method && r.path === fullPath
    );

    console.assert(found, `❌ Ruta ${method} ${fullPath} no encontrada`);
    if (found) {
      console.log(`✅ Ruta ${method} ${fullPath} existe`);
    }
  }
}

new EstadisticasGeneralesRoutesTest().runAllTests().catch((err) =>
  console.error("❌ Error ejecutando los tests de rutas:", err)
);
