import { Router } from "express";
import {
  getClientes,
  getClienteById,
  getClientesNaturales,
  getClientesJuridicos,
  getTiposCliente,
  crearCliente,
  getClientesFormateados,
  updateCliente,
  eliminarCliente,
} from "../controllers/clientes.controllers.js";

const router = Router();

router.get("/", getClientes);
router.get("/formateados", getClientesFormateados);
router.get("/:id", getClienteById);
router.get("/naturales", getClientesNaturales);
router.get("/juridicos", getClientesJuridicos);
router.get("/tipos-cliente", getTiposCliente);
router.put("/:id", updateCliente);
router.post("/", crearCliente);
router.put("/eliminar/:id", eliminarCliente);

export default router;
