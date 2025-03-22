import express from "express";

const router = express.Router();

import categoryController from "../controllers/categoriesController.js"; 
router.route("/")
    .get(categoryController.getCategories)
    .post(categoryController.createCategory);

router.route("/:id")
    .put(categoryController.updateCategory)
    .delete(categoryController.deleteCategory);

export default router;
