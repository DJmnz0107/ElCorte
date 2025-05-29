🥩 EL CORTE - Tienda de Carnes Premium 🛒


📋 Descripción del Proyecto
EL CORTE es una aplicación moderna para una tienda de carnes gourmet, desarrollada con:

Backend: Node.js + Express + MongoDB 🔗

Frontend: React Native + Vite ⚡

Estilos: Tailwind CSS 🎨

🚀 Cómo Empezar
📦 Requisitos Previos
Node.js v18+ 📦

MongoDB local o Atlas 🗄️

Git (opcional) 🔄

bash
# Verifica tu versión de Node
node --version
🛠️ Instalación Paso a Paso
🔙 Backend
bash
cd backend
npm install
Crea un archivo .env con:

env
PORT=5000
MONGO_URI=mongodb://localhost:27017/elcorte
JWT_SECRET=tu_clave_secreta_jwt
Inicia el servidor:

bash
node index.js
📱 Frontend
bash
cd frontendusers
npm install
npm run dev
📂 Estructura del Proyecto
el-corte/
├── backend/
│   ├── models/          # 🗃️ Modelos de MongoDB
│   ├── routes/          # 🛣️ Endpoints API
│   ├── controllers/     # 🎮 Lógica de negocio
│   └── ...             
│
└── frontendusers/
    ├── src/
    │   ├── components/  # 🧩 Componentes React
    │   ├── pages/       # 🖥️ Vistas principales
    │   └── ...
    └── ...
🌐 Endpoints Principales (API REST)
Método	Endpoint	Descripción
POST	/api/auth/login	Inicio de sesión 🔑
GET	/api/products	Obtener todos los productos 🥩
POST	/api/orders	Crear nueva orden 🛒
🎨 Tecnologías Utilizadas
Backend
Express.js

MongoDB

JWT

Frontend
React

Vite

Tailwind CSS

🔧 Variables de Entorno
env
# Backend
PORT=5000
MONGO_URI=mongodb://tu_usuario:tu_contraseña@localhost:27017/elcorte
JWT_SECRET=clave_super_secreta
🌍 Despliegue
Recomendamos estos servicios para producción:
Base de Datos: MongoDB Atlas
