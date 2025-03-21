/*
Campos:
firstName: String
lastName: String
email: String
password: String
dateOfBirth: Date
*/

const customerController = {};
import customersModel from "../models/Customers.js";

// SELECT 
customerController.getCustomers = async (req, res) => {
    const customers = await customersModel.find();
    res.json(customers);
};

// INSERT 
customerController.createCustomer = async (req, res) => {
    const { firstName, lastName, email, password, dateOfBirth } = req.body;

    const newCustomer = new customersModel({ firstName, lastName, email, password, dateOfBirth });
    await newCustomer.save();
    res.json({ message: "Cliente creado" });
};

// DELETE 
customerController.deleteCustomer = async (req, res) => {
    await customersModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Cliente eliminado" });
};

// UPDATE 
customerController.updateCustomer = async (req, res) => {    
    const { firstName, lastName, email, password, dateOfBirth } = req.body;

    const updatedCustomer = await customersModel.findByIdAndUpdate(
        req.params.id, 
        { firstName, lastName, email, password, dateOfBirth }, 
        { new: true }
    );

    res.json({ message: "Cliente actualizado" });
};

export default customerController;

