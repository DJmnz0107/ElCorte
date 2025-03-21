import express from "express";

const router = express.Router();

import suppliersController from "../controllers/suppliersController.js";

router.route("/")
.get(suppliersController.getSuppliers)
.post(suppliersController.createSupplier);

router.route("/:id")
.put(suppliersController.updateSupplier)
.delete(suppliersController.deleteSupplier);

export default router;