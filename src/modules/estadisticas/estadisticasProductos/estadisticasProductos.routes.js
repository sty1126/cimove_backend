import { Router } from "express";
import {
  getProductosBajoStockController,
  getHistoricoVentasProductoController,
  getProductosMasVendidosController,
  getProductosMasVendidosPorSedeController,
} from "./estadisticasProductos.controllers.js";

const router = Router();

// Productos con bajo stock
router.get("/bajo-stock", getProductosBajoStockController);

// Histórico de ventas de un producto
router.get("/historico-ventas-producto", getHistoricoVentasProductoController);

// Productos más vendidos
router.get("/mas-vendidos", getProductosMasVendidosController);

// Productos más vendidos por sede
router.get("/mas-vendidos-sede", getProductosMasVendidosPorSedeController);

export default router;
