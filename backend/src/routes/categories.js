import express from "express";

const router = express.Router();

import categoryController from "../controllers/categoriesController.js"; 
router.route("/")
    .get(categoryController.getCategories);

router.route("/:id")
    .put(categoryController.updateCategory)
    .delete(categoryController.deleteCategory);

export default router;
