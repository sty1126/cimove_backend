import { Router } from "express";
import {
  getClientes,
  getClientesFormateados,
  getClienteById,
  getClientesNaturales,
  getClientesJuridicos,
  getTiposCliente,
  updateCliente,
  createCliente,
  deleteCliente,
  getClientesPorSede,
} from "./clientes.controllers.js";

const router = Router();

router.get("/", getClientes);
router.get("/formateados", getClientesFormateados);
router.put("/eliminar/:id", deleteCliente);
router.get("/naturales", getClientesNaturales);
router.get("/juridicos", getClientesJuridicos);
router.get("/tipos-cliente", getTiposCliente);
router.get("/:id", getClienteById);
router.get("/sede/:idSede", getClientesPorSede);

router.post("/", createCliente);
router.put("/:id", updateCliente);

export default router;
