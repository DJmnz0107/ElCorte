/*
categoryName:
categoryDescription:
*/




import {Schema, model} from "mongoose";

const categoriesSchema = new Schema (

    {
        categoryName: {
            type:String,
            require:true
        },
        categoryDescription: {
            type:String,
            require:true
        }
    },
    {
        timestamps:true,
        strict:false
    }

);

export default model("Categories", categoriesSchema);