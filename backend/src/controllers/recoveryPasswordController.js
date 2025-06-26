import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import clientModel from "../models/Customers.js";
import employeeModel from "../models/Employees.js";
import { sendEmail, HTMLRecoveryEmail } from "../../utils/mailRecoveryPassword.js"
import { config } from "../config.js";

const recoveryPasswordController = {};

// 1. Enviar código al email
recoveryPasswordController.requestCode = async (req, res) => {
  const { email } = req.body;

  try {
    let userFound = await employeeModel.findOne({ email }) || await clientModel.findOne({ email });
    let userType = userFound instanceof employeeModel ? "employee" : "client";

    if (!userFound) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const code = Math.floor(10000 + Math.random() * 90000).toString();

    const token = jwt.sign(
      { email, code, userType, verified: false },
      config.JWT.secret,
      { expiresIn: "20m" }
    );

    res.cookie("tokenRecoveryCode", token, {
      httpOnly: true,
      maxAge: 20 * 60 * 1000,
    });

    await sendEmail(
      email,
      "Código de recuperación de contraseña",
      `Tu código de verificación es: ${code}`,
      HTMLRecoveryEmail(code)
    );

    res.json({ message: "Código enviado al correo electrónico" });

  } catch (error) {
    console.error("Error al enviar código:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// 2. Verificar código ingresado
recoveryPasswordController.verifyCode = async (req, res) => {
  const { code } = req.body;

  try {
    const token = req.cookies.tokenRecoveryCode;
    if (!token) return res.status(400).json({ message: "Token no encontrado" });

    const decoded = jwt.verify(token, config.JWT.secret);

    if (decoded.code !== code) {
      return res.status(401).json({ message: "Código incorrecto" });
    }

    const { exp, iat, ...rest } = decoded;

const newToken = jwt.sign(
  { ...rest, verified: true },
  config.JWT.secret,
  { expiresIn: "20m" }
);


    res.cookie("tokenRecoveryCode", newToken, {
      httpOnly: true,
      maxAge: 20 * 60 * 1000,
    });

    res.json({ message: "Código verificado correctamente" });

  } catch (error) {
    console.error("Error al verificar código:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// 3. Establecer nueva contraseña
recoveryPasswordController.newPassword = async (req, res) => {
  const { newPassword } = req.body;

  try {
    const token = req.cookies.tokenRecoveryCode;
    if (!token) return res.status(400).json({ message: "Token no encontrado" });

    const decoded = jwt.verify(token, config.JWT.secret);

    if (!decoded.verified) {
      return res.status(403).json({ message: "Código no verificado" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const { email, userType } = decoded;

    let model = userType === "employee" ? employeeModel : clientModel;
    const updatedUser = await model.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado al actualizar contraseña" });
    }

    res.clearCookie("tokenRecoveryCode");
    res.json({ message: "Contraseña actualizada correctamente" });

  } catch (error) {
    console.error("Error al actualizar contraseña:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export default recoveryPasswordController;
