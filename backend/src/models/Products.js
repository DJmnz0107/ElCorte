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

import {Schema, model} from "mongoose";

const productsSchema = new Schema (

    {
        price: {
            type:Number,
            require:true,
            min: 0
        },
        productName: {
            type:String,
            require:true
        },
        productDescription: {
            type:String,
            require:true
        },
        discount: {
            type:Number,
        },
        stock: {
            type:Number,
            require:true
        },
        image: {
            type:String
        },
        categoriesID: {
            type:Schema.Types.ObjectId,
            ref:"Categories",
            require:true
        },



    },
    {
        timestamps:true,
        strict:false
    }

);

export default model("Products", productsSchema);