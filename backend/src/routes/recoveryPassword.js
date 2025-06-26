import express from "express";
import recoveryPasswordController from "../controllers/recoveryPasswordController.js";

const router = express.Router();

// 1. Enviar código de recuperación
router.post("/request-code", recoveryPasswordController.requestCode);

// 2. Verificar código enviado por el usuario
router.post("/verify-code", recoveryPasswordController.verifyCode);

// 3. Establecer nueva contraseña
router.post("/new-password", recoveryPasswordController.newPassword);

export default router;
