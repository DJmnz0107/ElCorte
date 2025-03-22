import Employees from '../models/Employees.js';
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

employeesController.createEmployee = async (req, res) => {
    try {
        const { firstName, lastName, email, password, EmployeeDui, address, birthdate, salary, role } = req.body;
        const newEmployee = new Employees({
            firstName,
            lastName,
            email,
            password,
            EmployeeDui,
            address,
            birthdate,
            salary,
            role,
        });
        await newEmployee.save();
        res.json({ message: "Employee created successfully" });
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
