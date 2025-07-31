import { Router } from "express";
import * as controller from "./usuario.controllers.js";

const router = Router();

router.post("/create", controller.createUsuarioController);
router.post("/check-password", controller.checkPasswordController);
router.put("/update-password", controller.updatePasswordController);

export default router;
