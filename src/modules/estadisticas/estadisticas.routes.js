import { Router } from "express";
import ingresosRoutes from "./estadisticasIngresos/estadisticasIngresos.routes.js";
import generalesRoutes from "./estadisticasGenerales/estadisticasGenerales.routes.js";
import egresosRoutes from "./estadisticasEgresos/estadisticasEgresos.routes.js";
import clientesRoutes from "./estadisticasClientes/estadisticasClientes.routes.js";
import productosRoutes from "./estadisticasProductos/estadisticasProductos.routes.js";

const router = Router();

// Sub-rutas
router.use("/ingresos", ingresosRoutes);
router.use("/generales", generalesRoutes);
router.use("/egresos", egresosRoutes);
router.use("/clientes", clientesRoutes);
router.use("/productos", productosRoutes);

export default router;
