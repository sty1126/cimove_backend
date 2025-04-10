import express from "express";
import {
  getOrdenesCompra,
  createOrdenCompra,
  getOrdenCompraById,
} from "../controllers/ordenesCompra.controllers.js";

const router = express.Router();

router.get("/", getOrdenesCompra);
router.post("/", createOrdenCompra);
router.get("/:id", getOrdenCompraById);

export default router;
