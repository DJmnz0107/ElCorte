/*
Campos:
total
customersID
productID
amount
subTotal
status
*/

import {Schema, model} from "mongoose";

const orderSchema = new Schema(
    {
      customersID: {
        type: Schema.Types.ObjectId,
        ref: "Customers", 
        required: [true, "El ID del cliente es obligatorio"],
      },
      products: [
        {
          productID: {
            type: Schema.Types.ObjectId,
            ref: "Products", 
            required: true,
          },
          amount: {
            type: Number,
            min: [1, "La cantidad debe ser al menos 1"], // Cantidad mínima
            required: true,
          },
          subTotal: {
            type: Number,
            required: true,
            min: [0, "El subtotal no puede ser negativo"],
          },
        },
      ],
      total: {
        type: Number, // Total del pedido (suma de los subtotales de los productos)
        required: true,
        min: [0, "El total no puede ser negativo"],
      },
      status: {
        type: String,
        enum: {
          values: ["Pending", "Paid"],
          message: "El estado del pedido debe ser 'Pending' o 'Paid'",
        },
        default: "Pending",
      },
    },
    {
      timestamps: true, 
    }
  );

  export default model("Orders", orderSchema);