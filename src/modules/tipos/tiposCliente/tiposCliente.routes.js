import { Router } from "express";
import * as controller from "./tiposCliente.controllers.js";

const router = Router();

router.get("/", controller.getTiposClienteController);

export default router;
