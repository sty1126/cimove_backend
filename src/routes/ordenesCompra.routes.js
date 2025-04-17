import express from "express";
import {
  getOrdenesCompra,
  createOrdenCompra,
  getOrdenCompraById,
  procesarPedidoCarrito,
} from "../controllers/ordenesCompra.controllers.js";

const router = express.Router();

router.get("/", getOrdenesCompra);
router.post("/", createOrdenCompra);
router.get("/:id", getOrdenCompraById);
router.post("/procesar-pedido", procesarPedidoCarrito);

export default router;
