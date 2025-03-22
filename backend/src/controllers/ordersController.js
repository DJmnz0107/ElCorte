import Orders from "../models/Orders.js";
import mongoose from "mongoose";

const ordersController = {};

// GET: Obtener todas las órdenes
ordersController.getOrders = async (req, res) => {
  try {
    const orders = await Orders.find()
      .populate("customersID", "firstName email") // Población de customersID
      .populate("products.productID", "productName price"); // Población de productos
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error: error.message });
  }
};

// POST: Crear una nueva orden
ordersController.createOrders = async (req, res) => {
  const { customersID, products, status } = req.body;

  try {
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Products array is required and cannot be empty." });
    }

    if (!mongoose.Types.ObjectId.isValid(customersID)) {
      return res.status(400).json({ message: "El ID del cliente no es válido" });
    }

    const customerExists = await mongoose.model("Customers").findById(customersID);
    if (!customerExists) {
      return res.status(404).json({ message: "El cliente no existe" });
    }

    let total = 0;
    for (const product of products) {
      if (!product.subTotal || typeof product.subTotal !== "number") {
        return res.status(400).json({ message: "El subTotal de cada producto es obligatorio y debe ser un número." });
      }
      total += product.subTotal;
    }

    const newOrder = new Orders({
      customersID,
      products,
      total, 
      status,
    });

    await newOrder.save();

    res.status(201).json({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    res.status(400).json({ message: "Error creating order", error: error.message });
  }
};

// PUT: Actualizar una orden por ID
ordersController.updateOrders = async (req, res) => {
  const { customersID, products, status } = req.body;

  try {
    // Calcular el total si no se envía en la solicitud
    let total = 0;
    if (products && Array.isArray(products)) {
      for (const product of products) {
        if (!product.subTotal || typeof product.subTotal !== "number") {
          return res.status(400).json({ message: "El subTotal de cada producto es obligatorio y debe ser un número." });
        }
        total += product.subTotal;
      }
    }

    const updates = { customersID, products, total, status };

    const updatedOrder = await Orders.findByIdAndUpdate(req.params.id, updates, { new: true })
      .populate("customersID", "firstName email") 
      .populate("products.productID", "productName price"); 

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order updated successfully", order: updatedOrder });
  } catch (error) {
    res.status(400).json({ message: "Error updating order", error: error.message });
  }
};

// DELETE: Eliminar una orden por ID
ordersController.deleteOrders = async (req, res) => {
  try {
    const deletedOrder = await Orders.findByIdAndDelete(req.params.id);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error deleting order", error: error.message });
  }
};

export default ordersController;