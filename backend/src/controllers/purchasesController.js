const purchasesController = {};
import purchasesModel from '../models/Purchases.js';

purchasesController.getPurchases = async (req, res) => {
  try {
      const purchases = await purchasesModel.find()
          .populate('orderID')
          .populate('paymentMethodID'); 

      res.json(purchases);
  } catch (error) {
      console.error("Error al obtener las compras:", error);
      res.status(500).json({ message: "Error interno del servidor" });
  }
};

purchasesController.createPurchase = async (req, res) => {
    const {address, orderID, paymentMethodID, status} = req.body;

    const newPurchase = new purchasesModel({address, orderID, paymentMethodID, status})

    await newPurchase.save();
    res.json({message: "Purchase created"});
}

purchasesController.updatePurchase = async (req, res) => {
    const {address, orderID, paymentMethodID, status} = req.body;

    const updatePurchase = await purchasesModel.findByIdAndUpdate(
        req.params.id,
        {address, orderID, paymentMethodID, status}, {new:true});

    res.json({message: "Purchase updated"});
}

purchasesController.deletePurchase = async (req, res) => {
    const deletePurchase = await purchasesModel.findByIdAndDelete(req.params.id);
    res.json({message: "Purchase deleted"});
}

export default purchasesController;