/*
Campos:
firstName: String
lastName: String
email: String
password: String
dateOfBirth: Date
*/
import bcryptjs from "bcryptjs"; // Asegúrate de importar esto
import customersModel from "../models/Customers.js";

const customerController = {};

// SELECT 
customerController.getCustomers = async (req, res) => {
    const customers = await customersModel.find();
    res.json(customers);
};

// INSERT 
customerController.createCustomer = async (req, res) => {
    try {
        const { firstName, lastName, email, password, dateOfBirth } = req.body;

        // Verificar si ya existe un cliente con ese email
        const existingCustomer = await customersModel.findOne({ email });
        if (existingCustomer) {
            return res.status(400).json({ message: "El cliente ya existe con ese correo." });
        }

        // Encriptar la contraseña
        const passwordHash = await bcryptjs.hash(password, 10);

        // Crear el nuevo cliente
        const newCustomer = new customersModel({
            firstName,
            lastName,
            email,
            password: passwordHash, // contraseña encriptada
            dateOfBirth
        });

        await newCustomer.save();

        res.json({ message: "Cliente creado exitosamente." });

    } catch (error) {
        console.error("Error al crear cliente:", error);
        res.status(500).json({ message: "Error al registrar cliente." });
    }
};

// DELETE 
customerController.deleteCustomer = async (req, res) => {
    await customersModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Cliente eliminado" });
};

// UPDATE 
customerController.updateCustomer = async (req, res) => {    
    const { firstName, lastName, email, password, dateOfBirth } = req.body;

    let updateFields = { firstName, lastName, email, dateOfBirth };

    if (password) {
        // Si mandan nueva contraseña, encriptarla
        updateFields.password = await bcryptjs.hash(password, 10);
    }

    const updatedCustomer = await customersModel.findByIdAndUpdate(
        req.params.id, 
        updateFields, 
        { new: true }
    );

    res.json({ message: "Cliente actualizado" });
};

export default customerController;


