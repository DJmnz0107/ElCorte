/*
Campos
cardHolderName
paymentMethodType
cardNumber
cvv
expirationDate
customerId
*/

import {Schema, model} from "mongoose";

const paymentMethodSchema = new Schema (

    {
        cardHolderName: {
            type:String,
            require:true
        },
        paymentMethodType: {
            type:String,
            require:true
        },
        cardNumber: {
            type:Number,
            require:true
        },
        cvv: {
            type:Number,
            require:true
        },
        expirationDate: {
            type:Date,
            require:true
        },
        customerId: {
            type:Schema.Types.ObjectId,
            ref:"Customers",
            require:true
        }
    },
    {
        timestamps:true,
        strict:false
    }

);

export default model("PaymentMethod", paymentMethodSchema);