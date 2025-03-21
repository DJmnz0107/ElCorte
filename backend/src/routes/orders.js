import express from "express";

const router = express.Router();

import ordersController from "../controllers/ordersController.js";

router.route("/")
.get(ordersController.getOrders)
.post(ordersController.createOrders);

router.route("/:id")
.put(ordersController.updateOrders)
.delete(ordersController.deleteOrders); 

export default router;