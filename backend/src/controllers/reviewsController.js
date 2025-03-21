/*
Campos:
comments
rating
customersID
productID
*/

const reviewController = {};
import reviewsModel from "../models/Reviews.js";

//SELECT 

reviewController.getReviews = async (req, res) => {
    const reviews = await reviewsModel.find();
    res.json(reviews)
}

//INSERT 

reviewController.createReviews = async (req, res) => {
    const {comments, rating, customersID, productID} = req.body;

    const newReview = new reviewsModel({comments, rating, customersID, productID})

    await newReview.save();
    res.json({message:"Comentario creado"});
}

//DELETE 

reviewController.deleteReview= async (req, res) => {
    const deleteReview = await reviewsModel.findByIdAndDelete(req.params.id);
    res.json({message:"Comentario eliminado"});
}

//UPDATE

reviewController.updateReview = async (req, res) => {    
    const {comments, rating, customersID, productID} = req.body;

    const updateReview = await reviewsModel.findByIdAndUpdate(
        req.params.id, 
        {comments, rating, customersID, productID}, {new:true});

    res.json({message: "Comentario actualizado"});
}

export default reviewController;