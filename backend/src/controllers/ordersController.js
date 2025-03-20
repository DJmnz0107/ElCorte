/*
Campos:
total
customersID
productID
amount
subTotal
status
*/

import Orders from "../models/Orders.js";

const ordersController = {};

ordersController.getOrders = async (req, res) => {
    try {
      const orders = await Orders.find()
        .populate("customersID", "name email") 
        .populate("products.productID", "name price"); 
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: "Error fetching orders", error: error.message });
    }
  };


  ordersController.createOrders = async (req, res) => {
    const { idClient, products, total, status } = req.body;
  
    try {
      // Validar que los productos contengan los campos necesarios
      if (!products || !Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ message: "Products array is required and cannot be empty." });
      }
  
      const newOrder = new Orders({
        idClient,
        products,
        total,
        status,
      });
  
      await newOrder.save();
      res.status(201).json({ message: "Order created successfully" });
    } catch (error) {
      res.status(400).json({ message: "Error creating order", error: error.message });
    }
  };

  ordersController.updateOrders = async (req, res) => {
    const { idClient, products, total, status } = req.body;
  
    try {
      const updates = { idClient, products, total, status };
  
      const updatedOrder = await Orders.findByIdAndUpdate(req.params.id, updates, { new: true })
        .populate("idClient", "name email")
        .populate("products.idProduct", "name price");
  
      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }
  
      res.status(200).json({ message: "Order updated successfully"});
    } catch (error) {
      res.status(400).json({ message: "Error updating order", error: error.message });
    }
  };

  // DELETE: Eliminar un pedido por ID
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

