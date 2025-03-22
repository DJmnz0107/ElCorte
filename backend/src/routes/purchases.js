import express from "express";
const router = express.Router();
import purchasesController from "../controllers/purchasesController.js";

router.route("/")
    .get(purchasesController.getPurchases)
    .post(purchasesController.createPurchase);

router.route("/:id")
    .put(purchasesController.updatePurchase)
    .delete(purchasesController.deletePurchase);

export default router;
