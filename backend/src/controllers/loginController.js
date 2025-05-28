import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import clientModel from "../models/Customers.js";
import employeeModel from "../models/Employees.js";
import { config } from "../config.js";

const loginController = {};

loginController.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let userFound;
    let userType;
    let role;

    // Buscar primero en empleados
    userFound = await employeeModel.findOne({ email });

    if (userFound) {
      userType = "employee";
      role = userFound.role; // Asume que el modelo tiene un campo 'role'
    } else {
      // Si no está en empleados, buscar en clientes
      userFound = await clientModel.findOne({ email });

      if (userFound) {
        userType = "client";
        role = "client";
      }
    }

    if (!userFound) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Contraseña incorrecta" });
    }

    // Generar token
    jsonwebtoken.sign(
      { id: userFound._id, userType, role },
      config.JWT.secret,
      { expiresIn: config.JWT.expires },
      (error, token) => {
        if (error) {
          console.error("Error al generar token:", error);
          return res.status(500).json({ success: false, message: "Error al generar token" });
        }

        res.cookie("authToken", token, { httpOnly: true });
        return res.status(200).json({
          success: true,
          message: "Inicio de sesión exitoso",
          user: {
            id: userFound._id,
            userType,
            role,
          },
        });
      }
    );
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};

export default loginController;
