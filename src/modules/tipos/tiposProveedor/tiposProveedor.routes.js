import { Router } from "express";
import * as controller from "./tiposProveedor.controllers.js";

const router = Router();

router.get("/", controller.getTiposProveedorController);
router.post("/", controller.createTipoProveedorController);

export default router;
