/*
Campos:
suppliersName
address 
phone
*/

import {Schema, model} from "mongoose";

const suppliersSchema = new Schema (

    {
        suppliersName: {
            type:String,
            require:true
        },
        address: {
            type:String,
            require:true
        },
        phone: {
            type:String,
            require:true
        },
    },
    {
        timestamps:true,
        strict:false
    }

);

export default model("Suppliers", suppliersSchema);