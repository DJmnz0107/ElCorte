const purchasesController = {};
import purchasesModel from "../models/Purchase.js";

// GET: Obtener todas las compras
export const getPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find().populate("orderID paymentMethodID");
    res.status(200).json(purchases);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las compras", error });
  }
};

// GET: Obtener una compra específica por su ID
export const getPurchaseById = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id).populate("orderID paymentMethodID");
    if (!purchase) {
      return res.status(404).json({ message: "Compra no encontrada" });
    }
    res.status(200).json(purchase);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la compra", error });
  }
};

// POST: Crear una nueva compra
export const createPurchase = async (req, res) => {
  const { address, orderID, paymentMethodID, status } = req.body;

  try {
    const newPurchase = new Purchase({
      address,
      orderID,
      paymentMethodID,
      status
    });

    await newPurchase.save();
    res.status(201).json({ message: "Compra creada con éxito", purchase: newPurchase });
  } catch (error) {
    res.status(500).json({ message: "Error al crear la compra", error });
  }
};

// PUT: Actualizar una compra por su ID
export const updatePurchase = async (req, res) => {
  const { address, orderID, paymentMethodID, status } = req.body;

  try {
    const updatedPurchase = await Purchase.findByIdAndUpdate(
      req.params.id,
      { address, orderID, paymentMethodID, status },
      { new: true }
    );

    if (!updatedPurchase) {
      return res.status(404).json({ message: "Compra no encontrada" });
    }

    res.status(200).json({ message: "Compra actualizada", purchase: updatedPurchase });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la compra", error });
  }
};

// DELETE: Eliminar una compra por su ID
export const deletePurchase = async (req, res) => {
  try {
    const deletedPurchase = await Purchase.findByIdAndDelete(req.params.id);

    if (!deletedPurchase) {
      return res.status(404).json({ message: "Compra no encontrada" });
    }

    res.status(200).json({ message: "Compra eliminada con éxito" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la compra", error });
  }
};
