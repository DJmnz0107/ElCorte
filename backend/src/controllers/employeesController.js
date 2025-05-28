import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Employees from '../models/Employees.js';
import { config } from '../config.js';
const employeesController = {};

employeesController.getEmployees = async (req, res) => {
    try {
        const employees = await Employees.find();
        res.json(employees);
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};

employeesController.existeAdmin = async (req, res) => {
    try {
        const existeAdmin = await Employees.exists({ role: "Admin" });
        res.json({ existeAdmin: !!existeAdmin });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};  

employeesController.createEmployee = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            EmployeeDui,
            address,
            birthdate,
            salary
        } = req.body;

        // Verificar si el empleado ya existe
        const employeeExist = await Employees.findOne({ email });
        if (employeeExist) {
            return res.status(400).json({ message: "Employee already exists" });
        }

        // Encriptar la contraseña
        const passwordHash = await bcryptjs.hash(password, 10);

        // Contar cuántos empleados existen para asignar rol
        const employeeCount = await Employees.countDocuments();
        const role = employeeCount === 0 ? "Admin" : "Employee";

        const newEmployee = new Employees({
            firstName,
            lastName,
            email,
            password: passwordHash, // contraseña encriptada
            EmployeeDui,
            address,
            birthdate,
            salary,
            role,
        });

        await newEmployee.save();

        // Generar token JWT
        jwt.sign(
            { id: newEmployee._id }, // payload
            config.JWT.secret,       // clave secreta
            { expiresIn: config.JWT.expires }, // duración
            (error, token) => {
                if (error) {
                    console.error("Error generando token:", error);
                    return res.status(500).json({ message: "Token generation failed" });
                }

                res.cookie("authToken", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production", // para producción
                    sameSite: "strict"
                });

                res.json({
                    message: "Employee registered successfully",
                    role: newEmployee.role,
                    token
                });
            }
        );
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};


employeesController.updateEmployee = async (req, res) => {
    try {
        const { firstName, lastName, email, password, EmployeeDui, address, birthdate, salary, role } = req.body;

        const updatedEmployee = await Employees.findByIdAndUpdate(
            req.params.id,
            {
                firstName,
                lastName,
                email,
                password,
                EmployeeDui,
                address,
                birthdate,
                salary,
                role,
            },
            { new: true }
        );

        if (!updatedEmployee) {
            return res.status(404).json({
                message: "Employee not found",
            });
        }
        res.json({ message: "Employee updated successfully" });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};

employeesController.deleteEmployee = async (req, res) => {
    try {
        const deletedEmployee = await Employees.findByIdAndDelete(req.params.id);
        if (!deletedEmployee) {
            return res.status(404).json({
                message: "Employee not found",
            });
        }
        res.json({ message: "Employee deleted successfully" });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};

export default employeesController;
