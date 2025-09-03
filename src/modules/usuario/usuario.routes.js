import { Router } from "express";
import * as controller from "./usuario.controllers.js";

const router = Router();

router.post("/create", controller.createUsuarioController);
router.post("/check-password", controller.checkPasswordController);
router.put("/update-password", controller.updatePasswordController);
router.post("/request-password-reset", controller.requestPasswordResetController);
router.post("/reset-password", controller.resetPasswordController);

export default router;
