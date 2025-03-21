import express from "express";

const router = express.Router();

import paymentMethodController from "../controllers/PaymentMethodsController.js";

router.route("/")
.get(paymentMethodController.getPaymentMethods)
.post(paymentMethodController.createPaymentMethod);

router.route("/:id")
.put(paymentMethodController.updatePaymentMethod)
.delete(paymentMethodController.deletePaymentMethod);

export default router;