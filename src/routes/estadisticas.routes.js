import { Router } from "express";
import {
  getUltimosClientes,
  getUltimosAbonos,
  getProductosConStockBajo
} from "../controllers/estadisticas.controllers.js";

const router = Router();

router.get('/ultimos-clientes', getUltimosClientes);
router.get('/ultimos-abonos', getUltimosAbonos);
router.get('/productos-stock-bajo', getProductosConStockBajo);

export default router;