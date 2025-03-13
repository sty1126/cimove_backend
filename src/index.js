import express from "express";
import cors from "cors";
import { PORT } from "./config.js";
import productosRoutes from "./routes/productos.routes.js";
import inventarioRoutes from "./routes/inventario.routes.js";
import inventarioLocalRoutes from "./routes/inventariolocal.routes.js";
import categoriasRoutes from "./routes/categoria.routes.js";
import sedesRoutes from "./routes/sedes.routes.js";
import movimientoRoutes from "./routes/movimiento.routes.js";

const app = express();

app.use(cors()); // CORS
app.use(express.json()); // Uso de json

// rutas de la API
app.use("/api/productos", productosRoutes);
app.use("/api/inventario", inventarioRoutes);
app.use("/api/inventariolocal", inventarioLocalRoutes);
app.use("/api/categorias", categoriasRoutes);
app.use("/api/sedes", sedesRoutes);
app.use("/api/movimientos", movimientoRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
