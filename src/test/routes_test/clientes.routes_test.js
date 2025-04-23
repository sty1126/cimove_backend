import assert from "assert";
import express from "express";
import clientesRoutes from "../../routes/clientes.routes.js";

class ClientesRoutesTest {
  constructor() {
    this.app = express();
    this.routes = [];
  }

  setupApp() {
    this.app.use("/", clientesRoutes);
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
    console.log("🧪 Verificando rutas de clientes...");
  
    const expectedRoutes = [
      { path: "/", methods: ["get"] },
      { path: "/formateados", methods: ["get"] },
      { path: "/naturales", methods: ["get"] },
      { path: "/juridicos", methods: ["get"] },
      { path: "/tipos-cliente", methods: ["get"] },
      { path: "/:id", methods: ["get", "put"] },
      { path: "/", methods: ["post"] },
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
      console.log("✅ Todas las pruebas de rutas de clientes pasaron correctamente.");
    } catch (error) {
      console.error("❌ Error en pruebas de rutas de clientes:", error.message);
    }
  }
}

const test = new ClientesRoutesTest();
test.runAllTests();
 