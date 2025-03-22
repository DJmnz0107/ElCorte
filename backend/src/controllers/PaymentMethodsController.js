/*
Campos
cardHolderName
paymentMethodType
cardNumber
cvv
expirationDate
customerId
*/

const paymentMethodController = {};
import paymentMethodModel from "../models/PaymentMethods.js";

// SELECT
paymentMethodController.getPaymentMethods = async (req, res) => {
    const paymentMethods = await paymentMethodModel.find();
    res.json(paymentMethods);
};

// INSERT
paymentMethodController.createPaymentMethod = async (req, res) => {
    const { cardHolderName, paymentMethodType, cardNumber, cvv, expirationDate, customerId } = req.body;

    const newPaymentMethod = new paymentMethodModel({
        cardHolderName, 
        paymentMethodType, 
        cardNumber, 
        cvv, 
        expirationDate, 
        customerId
    });

    await newPaymentMethod.save();
    res.json({ message: "Método de pago creado" });
};

// DELETE
paymentMethodController.deletePaymentMethod = async (req, res) => {
    await paymentMethodModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Método de pago eliminado" });
};

// UPDATE
paymentMethodController.updatePaymentMethod = async (req, res) => {
    const { cardHolderName, paymentMethodType, cardNumber, cvv, expirationDate, customerId } = req.body;

    const updatedPaymentMethod = await paymentMethodModel.findByIdAndUpdate(
        req.params.id,
        { cardHolderName, paymentMethodType, cardNumber, cvv, expirationDate, customerId },
        { new: true }
    );

    res.json({ message: "Método de pago actualizado" });
};

export default paymentMethodController;