import express from "express";
import {
  getOrdenesCompra,
  createOrdenCompra,
  getOrdenCompraById,
  procesarPedidoCarrito,
  deleteOrdenCompra,
} from "./ordenesCompra.controllers.js";

const router = express.Router();

router.get("/", getOrdenesCompra);
router.post("/", createOrdenCompra);
router.get("/:id", getOrdenCompraById);
router.post("/procesar-pedido", procesarPedidoCarrito);
router.put("/eliminar/:id", deleteOrdenCompra);

export default router;
