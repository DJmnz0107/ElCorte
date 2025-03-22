/*
Campos
price
productName
productDescription
discount
stock
image
categoriesID
suppliersID
*/


const productsController = {};
import productsModel from "../models/Products.js";

//SELECT
productsController.getProducts = async (req, res) => {
    try {
        const products = await productsModel.find()
            .populate('categoriesID')  
            .populate('suppliersID');  
        
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


//INSERT

productsController.createProducts = async (req, res) => {
    const {price, productName, productDescription, discount, stock, image, categoriesID, suppliersID} = req.body;

    const newProduct = new productsModel({price, productName, productDescription, discount, stock, image, categoriesID, suppliersID})

    await newProduct.save();
    res.json({message:"Producto creado"});
}

//DELETE

productsController.deleteProduct= async (req, res) => {
    const deleteProduct = await productModel.findByIdAndDelete(req.params.id);
    res.json({message:"Producto eliminado"});
}

//UPDATE

productsController.updateProduct = async (req, res) => {
    const {price, productName, productDescription, discount, stock, image, categoriesID, suppliersID} = req.body;

    const updateProduct = await reviewModel.findByIdAndUpdate(
        req.params.id, 
        {price, productName, productDescription, discount, stock, image, categoriesID, suppliersID}, {new:true});

    res.json({message: "Producto actualizado"});
}

export default productsController;