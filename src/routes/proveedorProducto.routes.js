import express from "express";
import {
  getProveedoresByProducto,
  asociarProveedorAProducto,
  desasociarProveedorDeProducto,
} from "../controllers/proveedorProducto.controllers.js";

const router = express.Router();

router.get("/:id_producto", getProveedoresByProducto);
router.post("/", asociarProveedorAProducto);
router.delete("/:id_proveedorproducto", desasociarProveedorDeProducto);

export default router;
