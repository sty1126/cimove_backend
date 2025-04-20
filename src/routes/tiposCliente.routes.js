import express from "express";
import { getTiposCliente } from "../controllers/tiposCliente.controllers.js";

const router = express.Router();

router.get("/", getTiposCliente);

export default router;
