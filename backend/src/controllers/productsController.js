import productsModel from "../models/Products.js";
import { v2 as cloudinary } from "cloudinary";
import { config } from "../config.js";

// Configuración de Cloudinary
cloudinary.config({
    cloud_name: config.cloudinary.cloud_name,
    api_key: config.cloudinary.cloudinary_api_key,
    api_secret: config.cloudinary.cloudinary_api_secret
});

const productsController = {};

// SELECT
productsController.getProducts = async (req, res) => {
    try {
        const products = await productsModel.find()
            .populate('categoriesID')
            .populate('suppliersID');

        res.json(products);
    } catch (err) {
        console.error('Error al obtener productos:', err);
        res.status(500).json({ message: err.message });
    }
};

productsController.createProducts = async (req, res) => {
    console.log('📝 Datos recibidos en createProducts:', req.body);
    console.log('📷 Archivo recibido:', req.file);

    // Extraer datos de req.body (campos normales) y req.file (imagen)
    const { 
        productName,
        productDescription,
        price,
        stock,
        discount,
        categoriesID,
        suppliersID
    } = req.body;

    let imageUrl = "";

    // Manejo de imagen (Multer para archivos)
    if (req.file) {
        try {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "public",
                allowed_formats: ["jpg", "png", "jpeg", "gif", "webp", "avif"]
            });
            imageUrl = result.secure_url;
        } catch (error) {
            console.error('Error al subir imagen:', error);
            return res.status(500).json({ message: "Error al subir la imagen" });
        }
    }

    // Validaciones
    if (!price || isNaN(price) || parseFloat(price) <= 0) {
        return res.status(400).json({ message: "Precio inválido" });
    }

    const newProduct = new productsModel({
        productName,
        productDescription,
        price: parseFloat(price),
        stock: parseInt(stock),
        discount: discount ? parseFloat(discount) : 0,
        categoriesID,
        suppliersID,
        image: imageUrl
    });

    try {
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (err) {
        console.error('Error al guardar producto:', err);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// UPDATE - VERSIÓN CORREGIDA (ÚNICA)
productsController.updateProduct = async (req, res) => {
    console.log('📝 Actualizando producto ID:', req.params.id);
    console.log('📝 Datos recibidos:', req.body);

    const { 
        price, 
        productName,
        productDescription,
        discount, 
        stock, 
        categoriesID,
        suppliersID,
        image
    } = req.body;
    
    let imageUrl = req.body.image || "";

    // Manejar subida de nueva imagen
    if (req.file) {
        try {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "public",
                allowed_formats: ["jpg", "png", "jpeg", "gif", "webp", "avif"]
            });
            imageUrl = result.secure_url;
        } catch (error) {
            console.error('Error al subir imagen:', error);
            return res.status(500).json({ message: "Error al subir la imagen", error: error.message });
        }
    } else if (image && image.startsWith('data:image')) {
        try {
            const result = await cloudinary.uploader.upload(image, {
                folder: "public",
                allowed_formats: ["jpg", "png", "jpeg", "gif", "webp", "avif"]
            });
            imageUrl = result.secure_url;
        } catch (error) {
            console.error('Error al subir imagen base64:', error);
            return res.status(500).json({ message: "Error al subir la imagen", error: error.message });
        }
    }

    try {
        const updatedProduct = await productsModel.findByIdAndUpdate(
            req.params.id,
            {
                price: parseFloat(price),
                productName: productName?.trim(),
                productDescription: productDescription?.trim(),
                discount: discount ? parseFloat(discount) : 0,
                stock: parseInt(stock),
                image: imageUrl,
                categoriesID,
                suppliersID
            },
            { new: true, runValidators: true }  // ✅ AGREGADO: runValidators
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        console.log('✅ Producto actualizado:', updatedProduct);
        res.json({ 
            message: "Producto actualizado exitosamente", 
            product: updatedProduct 
        });
    } catch (err) {
        console.error('❌ Error al actualizar producto:', err);
        
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(e => e.message);
            return res.status(400).json({ 
                message: "Error de validación", 
                errors: errors 
            });
        }
        
        res.status(500).json({ 
            message: "Error al actualizar producto", 
            error: err.message 
        });
    }
};

// DELETE
productsController.deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await productsModel.findByIdAndDelete(req.params.id);
        
        if (!deletedProduct) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        console.log('🗑️ Producto eliminado:', deletedProduct);
        res.json({ message: "Producto eliminado exitosamente" });
    } catch (err) {
        console.error('❌ Error al eliminar producto:', err);
        res.status(500).json({ 
            message: "Error al eliminar producto", 
            error: err.message 
        });
    }
};

export default productsController;