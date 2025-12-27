const Order = require("../models/orderModel");
const Table = require("../models/tableModel");
const Dish = require("../models/dishModel");
const Category = require("../models/categoryModel");
const createHttpError = require("http-errors");
const mongoose = require("mongoose");

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
        // Sort createdAt: -1 biar orderan terbaru muncul paling atas
        const orders = await Order.find().populate('table').sort({ createdAt: -1 });
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

const getEarningAndTotalOrder = async (req, res, next) => {
    try {
        const start = new Date();
        start.setUTCHours(0 - 7, 0, 0, 0); // 00:00 WIB

        const end = new Date();
        end.setUTCHours(23 - 7, 59, 59, 999); // 23:59 WIB

        const resultEarnings = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: start, $lte: end },
                    orderStatus: { $ne: "Cancelled" } // optional
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

        res.status(200).json({ success: true, message: "Order updated successfully", data: { totalEarnings, totalOrders } });
    } catch (error) {
        next(error)
    }
}

const getOwnerDashboardStats = async (req, res) => {
  try {
    const { range = "today" } = req.query;

    // === 1. Date Range (WIB) ===
    const now = new Date();

    let end = new Date(now);
    end.setUTCHours(23 - 7, 59, 59, 999);

    let start = new Date(end);

    switch (range) {
      case "today":
        start.setUTCHours(0 - 7, 0, 0, 0);
        break;

      case "yesterday":
        start.setDate(start.getDate() - 1);
        start.setUTCHours(0 - 7, 0, 0, 0);

        end.setDate(end.getDate() - 1);
        end.setUTCHours(23 - 7, 59, 59, 999);
        break;

      case "last7days":
        start.setDate(start.getDate() - 6);
        start.setUTCHours(0 - 7, 0, 0, 0);
        break;

      case "last30days":
        start.setDate(start.getDate() - 29);
        start.setUTCHours(0 - 7, 0, 0, 0);
        break;

      default:
        return res.status(400).json({ message: "Invalid range" });
    }

    // === 2. Aggregate Query ===
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
              $cond: [
                { $eq: ["$paymentMethod", "CASH"] },
                "$bills.total",
                0
              ]
            }
          },

          onlineTotal: {
            $sum: {
              $cond: [
                { $ne: ["$paymentMethod", "ONLINE"] },
                "$bills.total",
                0
              ]
            }
          }
        }
      }
    ]);

    const totalCategory = await Category.countDocuments()
    const totalTable = await Table.countDocuments()
    const totalDish = await Dish.countDocuments()

    // === 3. Default kalau kosong ===
    const data = result[0] || {
      revenue: 0,
      totalOrders: 0,
      cashTotal: 0,
      onlineTotal: 0
    };

    return res.status(200).json({
      range,
      startDate: start,
      endDate: end,
      ...data,
      totalCategory: totalCategory || 0,
      totalTable: totalTable || 0,
      totalDish: totalDish || 0
    });

  } catch (error) {
    next(error)
  }
};

module.exports = { addOrder, getOrderById, getOrders, updateOrder, getMostOrderedItems, getEarningAndTotalOrder, getOwnerDashboardStats };