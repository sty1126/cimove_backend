import { Router } from "express";
import { getTiposProveedor, createTipoProveedor } from "../controllers/tipoproveedor.controllers.js";

const router = Router();

router.get("/", getTiposProveedor);
router.post("/", createTipoProveedor);

export default router;
