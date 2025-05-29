// middleware/authMiddleware.js
import jsonwebtoken from "jsonwebtoken";
import { config } from "../config.js";

const authMiddleware = (req, res, next) => {
  try {
    // Obtener token de la cookie
    const token = req.cookies.authToken;
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: "No hay token de autenticación" 
      });
    }

    // Verificar token
    const decoded = jsonwebtoken.verify(token, config.JWT.secret);
    
    // Agregar info del usuario al request
    req.user = decoded;
    next();
    
  } catch (error) {
    console.error("Error en middleware auth:", error);
    return res.status(401).json({ 
      success: false, 
      message: "Token inválido" 
    });
  }
};

export default authMiddleware;