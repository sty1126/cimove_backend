import { Router } from "express";
import {
  getClientes,
  getClienteById,
  getClientesNaturales,
  getClientesJuridicos,
  getTiposCliente,
  createCliente,
  getClientesFormateados,
  updateCliente,
} from "../controllers/clientes.controllers.js";

const router = Router();

router.get("/", getClientes);
router.get("/formateados", getClientesFormateados);
router.get("/:id", getClienteById);
router.get("/naturales", getClientesNaturales);
router.get("/juridicos", getClientesJuridicos);
router.get("/tipos-cliente", getTiposCliente);
router.put("/:id", updateCliente);
router.post("/", createCliente);

export default router;
