import { Router } from "express";
import { getTiposProveedor, createTipoProveedor } from "../controllers/tipoproveedor.controllers.js";

const router = Router();

router.get("/tipoproveedores", getTiposProveedor);
router.post("/tipoproveedores", createTipoProveedor);

export default router;
