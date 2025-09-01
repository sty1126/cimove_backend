import assert from "assert";
import express from "express";
import empleadosRoutes from "../../modules/empleados/empleados.routes.js";

class EmpleadosRoutesTest {
  constructor() {
    this.app = express();
    this.routes = [];
  }

  setupApp() {
    this.app.use("/", empleadosRoutes);
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
    console.log("🧪 Verificando rutas de empleados...");

    const expectedRoutes = [
      { path: "/", methods: ["get"] },
      { path: "/", methods: ["post"] },
      { path: "/:id", methods: ["get"] },
      { path: "/eliminar/:id", methods: ["put"] },
      { path: "/:id", methods: ["put"] },
    ];

    expectedRoutes.forEach((expected) => {
      const matchingRoutes = this.routes.filter((r) => r.path === expected.path);
      const allMethods = matchingRoutes.flatMap((r) => r.methods);
      const uniqueMethods = [...new Set(allMethods)];

      const allExpectedMethodsPresent = expected.methods.every((m) =>
        uniqueMethods.includes(m)
      );

      assert.ok(
        allExpectedMethodsPresent,
        `❌ Ruta ${expected.methods.join(",").toUpperCase()} ${expected.path} no está bien definida`
      );

      console.log(`✅ Ruta ${expected.methods.join(",").toUpperCase()} ${expected.path} OK`);
    });
  }

  runAllTests() {
    try {
      this.setupApp();
      this.testRoutesStructure();
      console.log("✅ Todas las pruebas de rutas de empleados pasaron correctamente.");
    } catch (error) {
      console.error("❌ Error en pruebas de rutas de empleados:", error.message);
    }
  }
}

const test = new EmpleadosRoutesTest();
test.runAllTests();
