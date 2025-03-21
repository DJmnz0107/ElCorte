import express from "express";

const router = express.Router();

import customerController from "../controllers/customersController.js";

router.route("/")
.get(customerController.getCustomers)
.post(customerController.createCustomer);

router.route("/:id")
.put(customerController.updateCustomer)
.delete(customerController.deleteCustomer);

export default router;