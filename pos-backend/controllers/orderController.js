const Order = require("../models/orderModel");
const createHttpError = require("http-errors");
const mongoose = require("mongoose"); // 👈 WAJIB DITAMBAHIN BIAR GAK CRASH

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

        // 👇 PERBAIKAN: Huruf 'i' KECIL
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
        const orders = await Order.find().populate('table');
        res.status(200).json({data: orders});
    } catch (error) {
        next(error);
    }
}

const updateOrder = async (req, res, next) => {
    try { 
        const { orderStatus } = req.body;
        const { id } = req.params;
        
        // 👇 PERBAIKAN: Huruf 'i' KECIL
        if(!mongoose.Types.ObjectId.isValid(id)){
            const error = createHttpError(400, "Invalid order ID");
            return next(error);
        }

        const order = await Order.findByIdAndUpdate(
            id,
            {orderStatus},
            {new: true}
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
    const limit = Number(req.query.limit) || 10; // /stats/top-items?limit=5

    const result = await Order.aggregate([
      // optional: filter status tertentu aja
      // { $match: { orderStatus: "Completed" } },

      { $unwind: "$items" },

      {
        $group: {
          _id: "$items.name",
          totalQty: { $sum: "$items.quantity" },             // jumlah unit terjual
          totalOrders: { $sum: 1 },                          // berapa kali item muncul (bukan order unik)
          totalRevenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }, // omzet item
          avgPrice: { $avg: "$items.price" },
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