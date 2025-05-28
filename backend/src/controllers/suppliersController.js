/*
Campos:
suppliersName
address 
phone
*/

const suppliersController = {};
import suppliersModel from "../models/Suppliers.js";

// SELECT 
suppliersController.getSuppliers = async (req, res) => {
    try {
        const suppliers = await suppliersModel.find();
        res.status(200).json(suppliers);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener proveedores", error: error.message });
    }
};

// INSERT 
suppliersController.createSupplier = async (req, res) => {
    try {
        const { suppliersName, address, phone } = req.body;
        
        // Validación básica
        if (!suppliersName || !address || !phone) {
            return res.status(400).json({ message: "Todos los campos son requeridos" });
        }

        const newSupplier = new suppliersModel({ suppliersName, address, phone });
        await newSupplier.save();
        res.status(201).json({ message: "Proveedor creado", supplier: newSupplier });
    } catch (error) {
        res.status(500).json({ message: "Error al crear proveedor", error: error.message });
    }
};

// DELETE 
suppliersController.deleteSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validar que el ID tenga el formato correcto
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "ID inválido" });
        }

        const deletedSupplier = await suppliersModel.findByIdAndDelete(id);
        
        if (!deletedSupplier) {
            return res.status(404).json({ message: "Proveedor no encontrado" });
        }

        res.status(200).json({ 
            message: "Proveedor eliminado exitosamente",
            deletedSupplier 
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Error al eliminar proveedor", 
            error: error.message 
        });
    }
};

// UPDATE
suppliersController.updateSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        const { suppliersName, address, phone } = req.body;

        // Validar que el ID tenga el formato correcto
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "ID inválido" });
        }

        const updatedSupplier = await suppliersModel.findByIdAndUpdate(
            id,
            { suppliersName, address, phone },
            { new: true, runValidators: true }
        );

        if (!updatedSupplier) {
            return res.status(404).json({ message: "Proveedor no encontrado" });
        }

        res.status(200).json({ 
            message: "Proveedor actualizado exitosamente",
            updatedSupplier 
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Error al actualizar proveedor", 
            error: error.message 
        });
    }
};

export default suppliersController;