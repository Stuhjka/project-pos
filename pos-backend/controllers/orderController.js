const Order = require("../models/orderModel");
const Table = require("../models/tableModel");
const Dish = require("../models/dishModel");
const Category = require("../models/categoryModel");
const createHttpError = require("http-errors");
const mongoose = require("mongoose");

// Helper untuk dapetin batas waktu WIB (GMT+7)
const getWIBBoundaries = (offsetDays = 0) => {
    const now = new Date();
    // Geser ke WIB
    const wibNow = new Date(now.getTime() + (7 * 60 * 60 * 1000));
    wibNow.setDate(wibNow.getDate() + offsetDays);
    wibNow.setUTCHours(0, 0, 0, 0); // Titik 00:00 di WIB
    
    // Balikin ke UTC untuk query database
    const startUTC = new Date(wibNow.getTime() - (7 * 60 * 60 * 1000));
    const endUTC = new Date(startUTC.getTime() + (24 * 60 * 60 * 1000) - 1);
    
    return { startUTC, endUTC };
};

const addOrder = async (req, res, next) => {
    try {
        const order = new Order(req.body);
        await order.save();
        res.status(201).json({ success: true, message: "Order created!", data: order });
    } catch (error) {
        next(error);
    }
}

const getOrderById = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            const error = createHttpError(400, "Invalid order ID");
            return next(error);
        }

        const order = await Order.findById(id);
        if (!order) {
            const error = createHttpError(404, "Order not found");
            return next(error);
        }

        res.status(200).json({ success: true, data: order });
    } catch (error) {
        next(error);
    }
}

const getOrders = async (req, res, next) => {
    try {
        const { filter } = req.query;
        let query = {};

        if (filter) {
            let { startUTC, endUTC } = getWIBBoundaries(0);

            switch (filter) {
                case "today":
                    query.createdAt = { $gte: startUTC, $lte: endUTC };
                    break;
                case "yesterday":
                    const yesterday = getWIBBoundaries(-1);
                    query.createdAt = { $gte: yesterday.startUTC, $lte: yesterday.endUTC };
                    break;
                case "last7days":
                    const last7 = getWIBBoundaries(-6);
                    query.createdAt = { $gte: last7.startUTC, $lte: endUTC };
                    break;
                case "last30days":
                    const last30 = getWIBBoundaries(-29);
                    query.createdAt = { $gte: last30.startUTC, $lte: endUTC };
                    break;
            }
        }

        const orders = await Order.find(query).populate('table').sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        next(error);
    }
}

const updateOrder = async (req, res, next) => {
    try {
        const { orderStatus } = req.body;
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
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

        res.status(200).json({ success: true, message: "Order updated successfully", data: order });
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
                    totalRevenue: { $sum: { $multiply: ["$items.quantity", "$items.pricePerQuantity"] } },
                    avgPrice: { $avg: "$items.pricePerQuantity" },
                },
            },
            {
                $lookup: {
                    from: "dishes",         
                    localField: "_id",      
                    foreignField: "title",  
                    as: "dishDetails"
                }
            },
            {
                $project: {
                    _id: 0,
                    name: "$_id",
                    totalQty: 1,
                    totalOrders: 1,
                    totalRevenue: 1,
                    avgPrice: { $round: ["$avgPrice", 0] },
                    image: { $arrayElemAt: ["$dishDetails.image", 0] } 
                },
            },
            { $sort: { totalQty: -1 } },
            { $limit: limit },
        ]);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

const getEarningAndTotalOrder = async (req, res, next) => {
    try {
        const { startUTC, endUTC } = getWIBBoundaries(0);

        const resultEarnings = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: startUTC, $lte: endUTC },
                    orderStatus: { $ne: "Cancelled" }
                }
            },
            {
                $group: {
                    _id: null,
                    totalEarnings: { $sum: "$bills.total" },
                    totalOrders: { $sum: 1 }
                }
            }
        ]);

        const totalEarnings = resultEarnings[0]?.totalEarnings ?? 0;
        const totalOrders = resultEarnings[0]?.totalOrders ?? 0;

        res.status(200).json({ success: true, message: "Stats fetched successfully", data: { totalEarnings, totalOrders } });
    } catch (error) {
        next(error)
    }
}

const getOwnerDashboardStats = async (req, res, next) => {
  try {
    const { range = "today" } = req.query;
    const today = getWIBBoundaries(0);
    let start = today.startUTC;
    let end = today.endUTC;

    switch (range) {
      case "today":
        break;
      case "yesterday":
        const yesterday = getWIBBoundaries(-1);
        start = yesterday.startUTC;
        end = yesterday.endUTC;
        break;
      case "last7days":
        start = getWIBBoundaries(-6).startUTC;
        break;
      case "last30days":
        start = getWIBBoundaries(-29).startUTC;
        break;
      default:
        return res.status(400).json({ message: "Invalid range" });
    }

    const result = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          bills: { $exists: true }
        }
      },
      {
        $group: {
          _id: null,
          revenue: { $sum: "$bills.total" },
          totalOrders: { $sum: 1 },
          cashTotal: {
            $sum: {
              $cond: [{ $eq: ["$paymentMethod", "CASH"] }, "$bills.total", 0]
            }
          },
          onlineTotal: {
            $sum: {
              $cond: [{ $eq: ["$paymentMethod", "ONLINE"] }, "$bills.total", 0]
            }
          }
        }
      }
    ]);

    const totalCategory = await Category.countDocuments();
    const totalTable = await Table.countDocuments();
    const totalDish = await Dish.countDocuments();
    const data = result[0] || { revenue: 0, totalOrders: 0, cashTotal: 0, onlineTotal: 0 };

    return res.status(200).json({
      range,
      startDate: start,
      endDate: end,
      ...data,
      totalCategory,
      totalTable,
      totalDish
    });
  } catch (error) {
    next(error)
  }
};

module.exports = { 
    addOrder, 
    getOrderById, 
    getOrders, 
    updateOrder, 
    getMostOrderedItems, 
    getEarningAndTotalOrder, 
    getOwnerDashboardStats 
};