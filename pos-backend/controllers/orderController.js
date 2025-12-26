const Order = require("../models/orderModel");
const createHttpError = require("http-errors");
const mongoose = require("mongoose");

const addOrder = async (req, res, next) => {
    try {
        const order = new Order(req.body); 
        await order.save();
        res.status(201).json({success: true, message: "Order created!", data: order});  
    } catch (error) {
        next(error);
    }
}

const getOrderById = async (req, res, next) => {
    try {
        const { id } = req.params;
        if(!mongoose.Types.ObjectId.isValid(id)){
            const error = createHttpError(400, "Invalid order ID");
            return next(error);
        }
        
        const order = await Order.findById(id);
        if (!order) {
            const error = createHttpError(404, "Order not found");
            return next(error);
        }

        res.status(200).json({success: true, data: order}); 
    } catch (error) {
        next(error);
    }
}

const getOrders = async (req, res, next) => {
    try {
        // Sort createdAt: -1 biar orderan terbaru muncul paling atas
        const orders = await Order.find().populate('table').sort({ createdAt: -1 });
        res.status(200).json({success: true, data: orders});
    } catch (error) {
        next(error);
    }
}

const updateOrder = async (req, res, next) => {
    try { 
        const { orderStatus } = req.body;
        const { id } = req.params;
        
        if(!mongoose.Types.ObjectId.isValid(id)){
            const error = createHttpError(400, "Invalid order ID");
            return next(error);
        }

        const order = await Order.findByIdAndUpdate(
            id,
            { orderStatus },
            { new: true }
        )

        if (!order) {
            const error = createHttpError(404, "Order not found");
            return next(error);
        }

        res.status(200).json({success: true, message: "Order updated successfully", data: order});

    } catch (error) {
        next(error);
    }
}

const getMostOrderedItems = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit) || 10; 

    const result = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.name",
          totalQty: { $sum: "$items.quantity" },            
          totalOrders: { $sum: 1 },                          
          // Hati-hati: Pastikan 'price' di items adalah harga satuan. 
          // Kalau dari frontend dikirim harga total, logic ini harus disesuaikan.
          totalRevenue: { $sum: { $multiply: ["$items.quantity", "$items.pricePerQuantity"] } }, 
          avgPrice: { $avg: "$items.pricePerQuantity" },
        },
      },
      { $sort: { totalQty: -1 } },
      { $limit: limit },
      {
        $project: {
          _id: 0,
          name: "$_id",
          totalQty: 1,
          totalOrders: 1,
          totalRevenue: 1,
          avgPrice: { $round: ["$avgPrice", 0] },
        },
      },
    ]);

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

module.exports = { addOrder, getOrderById, getOrders, updateOrder, getMostOrderedItems };