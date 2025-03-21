/*
Campos:
firstName: String
lastName: String
email: String
password: String
dateOfBirth: Date
*/

import {Schema, model} from "mongoose";

const customersSchema = new Schema (

    {
        firstName: {
            type:String,
            require:true
        },
        lastName: {
            type:Number,
            require:true
        },
        email: {
            type:String,
            require:true
        },
        password: {
            type:String,
            require:true
        },
        dateOfBirth: {
            type:Date,
            require:true
        },
    },
    {
        timestamps:true,
        strict:false
    }

);

export default model("Customers", customersSchema);
