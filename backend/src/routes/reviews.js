import express from "express";

const router = express.Router();

import reviewsController from "../controllers/reviewsController.js";

router.route("/")
.get(reviewsController.getReviews)
.post(reviewsController.createReviews);

router.route("/:id")
.put(reviewsController.updateReview)
.delete(reviewsController.deleteReview);

export default router;