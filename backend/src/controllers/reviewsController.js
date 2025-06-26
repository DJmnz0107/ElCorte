/* Campos: comments rating customersID productID */
const reviewController = {};
import reviewsModel from "../models/Reviews.js";

// GET - Obtener todas las reseñas
reviewController.getReviews = async (req, res) => {
    try {
        const reviews = await reviewsModel.find()
            .populate('customersID')  // Populate para el cliente
            .populate('productID');   // Populate para el producto
                 
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// GET - Obtener reseñas por producto
reviewController.getReviewsByProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const reviews = await reviewsModel.find({ productID: productId })
            .populate('customersID')
            .populate('productID')
            .sort({ createdAt: -1 }); // Ordenar por fecha, más recientes primero
        
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// GET - Obtener reseñas por cliente
reviewController.getReviewsByCustomer = async (req, res) => {
    try {
        const { customerId } = req.params;
        const reviews = await reviewsModel.find({ customersID: customerId })
            .populate('customersID')
            .populate('productID')
            .sort({ createdAt: -1 }); // Ordenar por fecha, más recientes primero
        
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// POST - Crear una nueva reseña
reviewController.createReviews = async (req, res) => {
    try {
        const { comments, rating, customersID, productID } = req.body;
        
        // Validaciones básicas
        if (!comments || !rating || !customersID || !productID) {
            return res.status(400).json({ 
                message: "Todos los campos son requeridos: comments, rating, customersID, productID" 
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ 
                message: "La calificación debe estar entre 1 y 5" 
            });
        }

        // Verificar si el usuario ya dejó una reseña para este producto
        const existingReview = await reviewsModel.findOne({ 
            customersID: customersID, 
            productID: productID 
        });

        if (existingReview) {
            return res.status(400).json({ 
                message: "Ya has dejado una reseña para este producto" 
            });
        }

        const newReview = new reviewsModel({
            comments, 
            rating, 
            customersID, 
            productID
        });

        const savedReview = await newReview.save();
        
        // Popular los datos antes de enviar la respuesta
        const populatedReview = await reviewsModel.findById(savedReview._id)
            .populate('customersID')
            .populate('productID');

        res.status(201).json({
            message: "Comentario creado exitosamente",
            review: populatedReview
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// PUT - Actualizar una reseña
reviewController.updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { comments, rating, customersID, productID } = req.body;
        
        // Validaciones básicas
        if (rating && (rating < 1 || rating > 5)) {
            return res.status(400).json({ 
                message: "La calificación debe estar entre 1 y 5" 
            });
        }

        const updateData = {};
        if (comments !== undefined) updateData.comments = comments;
        if (rating !== undefined) updateData.rating = rating;
        if (customersID !== undefined) updateData.customersID = customersID;
        if (productID !== undefined) updateData.productID = productID;

        const updatedReview = await reviewsModel.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true }
        ).populate('customersID').populate('productID');

        if (!updatedReview) {
            return res.status(404).json({ message: "Reseña no encontrada" });
        }

        res.json({
            message: "Comentario actualizado exitosamente",
            review: updatedReview
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// DELETE - Eliminar una reseña
reviewController.deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        
        const deletedReview = await reviewsModel.findByIdAndDelete(id);
        
        if (!deletedReview) {
            return res.status(404).json({ message: "Reseña no encontrada" });
        }

        res.json({ 
            message: "Comentario eliminado exitosamente",
            deletedReview: deletedReview
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export default reviewController;