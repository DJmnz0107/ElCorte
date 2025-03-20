import express from "express";

const router = express.Router();

import productsController from "../controllers/productsController";

router.route("/")
.get(productsController.getProducts)
.post(productsController.createProducts);

router.route("/:id")
.put(productsController.updateProduct)
.delete(productsController.deleteProduct);

export default router;