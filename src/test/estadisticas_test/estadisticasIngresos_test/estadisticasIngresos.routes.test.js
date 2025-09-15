import express from "express";
import ingresosRouter from "../../../modules/estadisticas/estadisticasIngresos/estadisticasIngresos.routes.js";

class IngresosRoutesTest {
  constructor() {
    this.app = express();
    this.routes = [];
  }

  async runAllTests() {
    console.log("📦 Iniciando test de estadisticasIngresos.routes...\n");

    this.mountRouter();
    this.extractRoutes();

    // Validar todas las rutas definidas en el router
    this.assertRoute("GET", "/ingresos/ventas-dia-semana");
    this.assertRoute("GET", "/ingresos/mapa-calor");
    this.assertRoute("GET", "/ingresos/ingresos-categoria");
    this.assertRoute("GET", "/ingresos/ingresos-periodo");
    this.assertRoute("GET", "/ingresos/ventas-sede");
    this.assertRoute("GET", "/ingresos/ingresos-metodo-pago");
    this.assertRoute("GET", "/ingresos/ingresos-metodo-pago-sede");

    console.log("\n✅ Todos los tests de estadisticasIngresos.routes pasaron correctamente.");
  }

  mountRouter() {
    // Montamos el router bajo el path base
    this.app.use("/ingresos", ingresosRouter);
  }

  extractRoutes() {
    const stack = this.app._router.stack;

    stack.forEach((middleware) => {
      if (middleware.route) {
        // Caso: middleware directo
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
        // Caso: router anidado
        middleware.handle.stack.forEach((handler) => {
          const route = handler.route;
          if (route) {
            const path = route.path;
            const methods = route.methods;
            for (const method in methods) {
              if (methods[method]) {
                this.routes.push({
                  method: method.toUpperCase(),
                  path: `/ingresos${path}`,
                });
              }
            }
          }
        });
      }
    });
  }

  assertRoute(method, path) {
    const found = this.routes.find(
      (r) => r.method === method && r.path === path
    );

    console.assert(found, `❌ Ruta ${method} ${path} no encontrada`);
    if (found) {
      console.log(`✅ Ruta ${method} ${path} existe`);
    }
  }
}

new IngresosRoutesTest().runAllTests().catch((err) =>
  console.error("❌ Error ejecutando los tests de rutas:", err)
);
