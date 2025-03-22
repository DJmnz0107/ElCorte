/*
Campos:
address
orderID
paymentMethodID
status
*/
import mongoose from "mongoose";
const { Schema, model } = mongoose;

const purchasesSchema = new Schema({
  address: {
    type: String,
    required: true,
  },
  orderID: {
    type: Schema.Types.ObjectId,
    ref: "Orders",
    required: true,
  },
  paymentMethodID: {
    type: Schema.Types.ObjectId,
    ref: "PaymentMethod",
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
}, {
    timestamps:true,
    strict:false
}
);

export default model("Purchases", purchasesSchema);