import express from "express";

const router = express.Router();

import reviewsController from "../controllers/reviewsController.js";

router.route("/")
    .get(reviewsController.getReviews)      
    .post(reviewsController.createReviews); 

// Rutas específicas por producto y cliente (van antes de /:id para evitar conflictos)
router.route("/product/:productId")
    .get(reviewsController.getReviewsByProduct); // GET /api/reviews/product/:productId

router.route("/customer/:customerId")
    .get(reviewsController.getReviewsByCustomer); // GET /api/reviews/customer/:customerId

// Rutas por ID (van al final)
router.route("/:id")
    .put(reviewsController.updateReview)    // PUT /api/reviews/:id - Actualizar reseña
    .delete(reviewsController.deleteReview); // DELETE /api/reviews/:id - Eliminar reseña

export default router;