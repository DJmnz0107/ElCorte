import express from 'express';

import ordersRoutes from "./src/routes/orders.js"
import productRoutes from "./src/routes/products.js"
import reviewRoutes from "./src/routes/reviews.js"
import employeesRoutes from './src/routes/employees.js';
import categoriesRoutes from './src/routes/categories.js'
import purchasesRoutes from './src/routes/purchases.js'
import suppliersRoutes from './src/routes/suppliers.js'
import customersRoutes from './src/routes/customers.js'
import paymentsRoutes from './src/routes/paymentMethods.js'


const app = express();

app.use(express.json());
app.use("/api/products", productRoutes);
app.use("/api/orders", ordersRoutes );
app.use("/api/reviews", reviewRoutes);
app.use("/api/employees", employeesRoutes);
app.use("/api/categories" , categoriesRoutes);
app.use("/api/purchases" , purchasesRoutes);
app.use("/api/suppliers" , suppliersRoutes);
app.use("/api/customers" , customersRoutes);
app.use("/api/payments" , paymentsRoutes);


app.use(express.json());


export default app;