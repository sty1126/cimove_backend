import express from "express";
import { PORT } from "./config.js";
import productosRoutes from "./routes/productos.routes.js";

const app = express();

app.use(productosRoutes);

// Asignación de puerto importada desde config.js
app.listen(PORT);
console.log("Server on port", PORT);
