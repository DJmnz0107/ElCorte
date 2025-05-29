import express from "express";
import multer from "multer";
const router = express.Router();

import productsController from "../controllers/productsController.js";

const upload = multer({dest: "public/"})

router.route("/")
.get(productsController.getProducts)
.post(upload.single("image"), productsController.createProducts);

router.route("/:id")
.put(productsController.updateProduct)
.delete(upload.single("image"),productsController.deleteProduct);

export default router;