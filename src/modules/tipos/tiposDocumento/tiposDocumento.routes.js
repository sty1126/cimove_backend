import { Router } from "express";
import * as controller from "./tiposDocumento.controllers.js";

const router = Router();

router.get("/", controller.getTiposDocumentoController);

export default router;
