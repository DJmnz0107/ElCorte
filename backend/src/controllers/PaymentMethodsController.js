/* Campos cardHolderName paymentMethodType cardNumber cvv expirationDate customerId */
const paymentMethodController = {};
import paymentMethodModel from "../models/PaymentMethods.js";

// SELECT
paymentMethodController.getPaymentMethods = async (req, res) => {
    try {
        const paymentMethods = await paymentMethodModel.find();
        res.json(paymentMethods);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// INSERT - FIXED: Now returns the created payment method
paymentMethodController.createPaymentMethod = async (req, res) => {
    try {
        const { cardHolderName, paymentMethodType, cardNumber, cvv, expirationDate, customerId } = req.body;
        
        const newPaymentMethod = new paymentMethodModel({
            cardHolderName,
            paymentMethodType,
            cardNumber,
            cvv,
            expirationDate,
            customerId
        });
        
        // Save and return the created object
        const savedPaymentMethod = await newPaymentMethod.save();
        
        // Return both message and the created object
        res.status(201).json({
            message: "Método de pago creado",
            data: savedPaymentMethod // This is what was missing!
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE
paymentMethodController.deletePaymentMethod = async (req, res) => {
    try {
        const deletedPaymentMethod = await paymentMethodModel.findByIdAndDelete(req.params.id);
        
        if (!deletedPaymentMethod) {
            return res.status(404).json({ error: "Método de pago no encontrado" });
        }
        
        res.json({ 
            message: "Método de pago eliminado",
            data: deletedPaymentMethod 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// UPDATE - FIXED: Now returns the updated payment method
paymentMethodController.updatePaymentMethod = async (req, res) => {
    try {
        const { cardHolderName, paymentMethodType, cardNumber, cvv, expirationDate, customerId } = req.body;
        
        const updatedPaymentMethod = await paymentMethodModel.findByIdAndUpdate(
            req.params.id,
            { cardHolderName, paymentMethodType, cardNumber, cvv, expirationDate, customerId },
            { new: true } // This returns the updated document
        );
        
        if (!updatedPaymentMethod) {
            return res.status(404).json({ error: "Método de pago no encontrado" });
        }
        
        res.json({ 
            message: "Método de pago actualizado",
            data: updatedPaymentMethod // Return the updated object
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export default paymentMethodController;