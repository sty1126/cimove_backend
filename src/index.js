import express from "express";
import { PORT } from "./config.js";
import productosRoutes from "./routes/productos.routes.js";
import inventarioRoutes from "./routes/inventario.routes.js";

const app = express();

app.use(express.json());
app.use(productosRoutes);
app.use(inventarioRoutes);

// Asignación de puerto importada desde config.js
app.listen(PORT);
console.log("Server on port", PORT);
