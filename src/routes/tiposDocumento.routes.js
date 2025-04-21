import { Router } from "express";
import { getTiposDocumento } from "../controllers/tiposDocumento.controllers.js";

const router = Router();

router.get("/", getTiposDocumento);

export default router;
