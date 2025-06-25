import nodemailer from "nodemailer";
import { config } from "../src/config.js"; // ✅ Correcto

// Crear el transportador de nodemailer con la configuración SMTP de Gmail
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465, // O puedes usar 587 si encuentras problemas con el 465
    secure: true, // Usa SSL/TLS para la conexión
    auth: {
        user: config.emailUser.user_email, // Asegúrate de que estas credenciales sean correctas
        pass: config.emailUser.user_pass // Asegúrate de que la contraseña sea correcta
    }
});

// Función para enviar el correo
const sendEmail = async (to, subject, text, code) => {
    try {
        const info = await transporter.sendMail({
            from: 'El Corte <la.galletapez@gmail.com>', // Dirección del remitente
            to, // Dirección del destinatario
            subject, // Asunto del correo
            text, // Texto sin formato del correo
            html: HTMLRecoveryEmail(code) // El contenido HTML del correo (lo generamos con la función HTMLRecoveryEmail)
        });
        
        console.log("Email sent successfully:", info);
        return info;
    } catch (error) {
        console.error("Error sending email:", error); // Registra cualquier error
    }
};

// Función para generar el contenido HTML del correo de recuperación de contraseña
const HTMLRecoveryEmail = (code) => {
    return `
      <div style="font-family: Arial, sans-serif; text-align: center; background-color: #f4f4f9; padding: 20px; border: 1px solid #ddd; border-radius: 10px; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2c3e50; font-size: 24px; margin-bottom: 20px;">Password Recovery</h1>
        <p style="font-size: 16px; color: #555; line-height: 1.5;">
          Hello, we received a request to reset your password. Use the verification code below to proceed:
        </p>
        <div style="display: inline-block; padding: 10px 20px; margin: 20px 0; font-size: 18px; font-weight: bold; color: #fff; background-color: #ff7f50; border-radius: 5px; border: 1px solid #e67e22;">
          ${code}
        </div>
        <p style="font-size: 14px; color: #777; line-height: 1.5;">
          This code is valid for the next <strong>15 minutes</strong>. If you didn’t request this email, you can safely ignore it.
        </p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <footer style="font-size: 12px; color: #aaa;">
          If you need further assistance, please contact our support team at
          <a href="mailto:support@example.com" style="color: #3498db; text-decoration: none;">support@example.com</a>.
        </footer>
      </div>
    `;
};

// Exportar las funciones para que puedan ser usadas en otros archivos
export { sendEmail, HTMLRecoveryEmail };