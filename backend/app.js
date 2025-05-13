import express from 'express';
import cors from 'cors'; 
import cookieParser from 'cookie-parser'; // ✅

import ordersRoutes from "./src/routes/orders.js";
import productRoutes from "./src/routes/products.js";
import reviewRoutes from "./src/routes/reviews.js";
import employeesRoutes from './src/routes/employees.js';
import categoriesRoutes from './src/routes/categories.js';
import purchasesRoutes from './src/routes/purchases.js';
import suppliersRoutes from './src/routes/suppliers.js';
import customersRoutes from './src/routes/customers.js';
import paymentsRoutes from './src/routes/paymentMethods.js';
import loginRoutes from './src/routes/login.js';
import logoutRoutes from './src/routes/logout.js';
import recoveryPasswordRoutes from './src/routes/recoveryPassword.js';

const app = express();

app.use(cors({
  origin: "http://localhost:5173", // el puerto de tu frontend Vite
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser()); // ✅ Middleware necesario para acceder a req.cookies

app.use("/api/products", productRoutes);
app.use("/api/orders", ordersRoutes );
app.use("/api/reviews", reviewRoutes);
app.use("/api/employees", employeesRoutes);
app.use("/api/categories" , categoriesRoutes);
app.use("/api/purchases" , purchasesRoutes);
app.use("/api/suppliers" , suppliersRoutes);
app.use("/api/customers" , customersRoutes);
app.use("/api/payments" , paymentsRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/logout", logoutRoutes);
app.use("/api/recovery", recoveryPasswordRoutes);
app.use("/api/recovery", recoveryPasswordRoutes);
app.use("/api/recovery", recoveryPasswordRoutes);

export default app;
//ESTO ES UNA PRUEBA