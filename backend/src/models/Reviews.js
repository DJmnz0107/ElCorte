/*
Campos:
comments
rating
customersID
productID
*/

import {Schema, model} from "mongoose";

const reviewsSchema = new Schema (

    {
        comments: {
            type:String,
            require:true
        },
        rating: {
            type:Number,
            require:true
        },
        customersID: {
            type:Schema.Types.ObjectId,
            ref:"Customers",
            require:true
        },
        productID: {
            type:Schema.Types.ObjectId,
            ref:"Products",
            require:true
        },
    },
    {
        timestamps:true,
        strict:false
    }

);

export default model("Reviews", reviewsSchema);
