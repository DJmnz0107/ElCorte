import express from "express";
const router = express.Router();
import purchasesController from "../controllers/purchasesController.js";

router.route("/")
    .get(purchasesController.getPurchases);

router.route("/:id")
    .put(purchasesController.updateCategory)
    .delete(purchasesController.deleteCategory);

export default router;
