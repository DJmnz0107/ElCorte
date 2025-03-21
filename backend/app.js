import express from 'express';

import ordersRoutes from "./src/routes/orders.js"
import productRoutes from "./src/routes/products.js"
import reviewRoutes from "./src/routes/reviews.js"

const app = express();

app.use(express.json());
app.use("/api/products", productRoutes);
app.use("/api/orders", ordersRoutes );
app.use("/api/reviews", reviewRoutes);

app.use(express.json());


export default app;