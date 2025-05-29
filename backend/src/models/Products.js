/* Campos price productName productDescription discount stock image categoriesID suppliersID */
import {Schema, model} from "mongoose";

const productsSchema = new Schema(
    {
        price: {
            type: Number,
            required: true,  // ✅ CORREGIDO: require → required
            min: 0
        },
        productName: {
            type: String,
            required: true   // ✅ CORREGIDO: require → required
        },
        productDescription: {
            type: String,
            required: true   // ✅ CORREGIDO: require → required
        },
        discount: {
            type: Number,
            default: 0       // ✅ AGREGADO: valor por defecto
        },
        stock: {
            type: Number,
            required: true   // ✅ CORREGIDO: require → required
        },
        image: {
            type: String
        },
        categoriesID: {
            type: Schema.Types.ObjectId,
            ref: "Categories",
            required: true   // ✅ CORREGIDO: require → required
        },
        suppliersID: {
            type: Schema.Types.ObjectId,
            ref: "Suppliers",
            required: true   // ✅ CORREGIDO: require → required
        },
    },
    {
        timestamps: true,
        strict: false
    }
);

export default model("Products", productsSchema);