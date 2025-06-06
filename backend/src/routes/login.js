import express from "express"
import loginController from "../controllers/loginController.js";

const router = express.Router();

router.route("/").post(loginController.login);
router.route("/verify-token").get(loginController.verifyToken);

export default router;