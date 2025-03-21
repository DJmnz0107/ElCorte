/*
Campos:
categoryName
categoryDescription
*/

const categoryController = {};
import categoriesModel from "../models/Categories.js";

// SELECT 

categoryController.getCategories = async (req, res) => {
    const categories = await categoriesModel.find();
    res.json(categories);
}

// INSERT 

categoryController.createCategory = async (req, res) => {
    const {categoryName, categoryDescription} = req.body;

    const newCategory = new categoriesModel({categoryName, categoryDescription});

    await newCategory.save();
    res.json({message: "Categoría creada"});
}

// DELETE 

categoryController.deleteCategory = async (req, res) => {
    const deleteCategory = await categoriesModel.findByIdAndDelete(req.params.id);
    res.json({message: "Categoría eliminada"});
}

// UPDATE 

categoryController.updateCategory = async (req, res) => {    
    const {categoryName, categoryDescription} = req.body;

    const updateCategory = await categoriesModel.findByIdAndUpdate(
        req.params.id, 
        {categoryName, categoryDescription}, {new: true}
    );

    res.json({message: "Categoría actualizada"});
}

export default categoriesController;
