/*
firstName
lastName
email
password
dateOfBirth
employeeDui
salary
role
*/

import { Schema, model } from "mongoose";

const employeesSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
            match: [
                /^[A-Za-z\s]+$/,
                "El nombre solo puede contener letras y espacios",
            ], // Solo letras y espacios
            minlength: [3, "El nombre debe tener al menos 3 caracteres"],
        },
        lastName: {
            type: String,
            required: true,
            match: [
                /^[A-Za-z\s]+$/,
                "El nombre solo puede contener letras y espacios",
            ], // Solo letras y espacios
            minlength: [3, "El nombre debe tener al menos 3 caracteres"],
            email: {
                type: String,
                required: true,
                unique: true,
                lowercase: true,
                trim: true,
                match: [
                    /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
                    "Por favor, ingrese un correo electrónico válido",
                ],
            },
            password: {
                type: String,
                required: true,
                minlength: 6,
            },
            EmployeeDui: {
                type: String,
                required: true,
                unique: true,
                match: [/^\d{8}-\d$/, "Invalid DUI format. Must follow XXXXXXXX-X."],
            },
            address: {
                type: String,
                required: true,
                minlength: 10,
            },
            birthdate: {
                type: Date,
                required: true,
                max: [new Date(), "La fecha de nacimiento no puede ser una fecha futura"],
                message: "La fecha de nacimiento no puede ser una fecha futura",
            },
            salary: {
                type: Number,
                required: true,
                max: [10000, "El salario no puede ser mayor a $10,000"],
            },
            role: {
                type: String,
                required: true,
                enum: {
                    values: ["Admin", "Employee"],
                    message: "El rol solo puede ser 'Admin' o 'Employee'",
                },
            },
        },
    },
    {
        timestamps: true,
        strict: false,
    }
);

export default model("Employees", employeesSchema);