/*
Campos:
suppliersName
address 
phone
*/

const suppliersController = {};
import suppliersModel from "../models/Suppliers.js";

//SELECT 

suppliersController.getSuppliers = async (req, res) => {
    const suppliers = await suppliersModel.find();
    res.json(suppliers)
}

//INSERT 

suppliersController.createSupplier = async (req, res) => {
    const { suppliersName, address, phone } = req.body;
    const newSupplier = new suppliersModel({ suppliersName, address, phone });
    await newSupplier.save();
    res.json({ message: "Proveedor creado" });
};

//DELETE 

suppliersController.deleteSupplier = async (req, res) => {
    await suppliersModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Proveedor eliminado" });
};

//UPDATE

suppliersController.updateSupplier = async (req, res) => {
    const { suppliersName, address, phone } = req.body;
    const updatedSupplier = await suppliersModel.findByIdAndUpdate(
        req.params.id,
        { suppliersName, address, phone },
        { new: true }
    );
    res.json({ message: "Proveedor actualizado"});
};


export default suppliersController;