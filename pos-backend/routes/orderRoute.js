const express = require("express");
const { addOrder, getOrders, getOrderById, updateOrder, getMostOrderedItems, getEarningAndTotalOrder, getOwnerDashboardStats } = require("../controllers/orderController");
const { isVerifiedUser } = require("../middleware/tokenVerification");
const router = express.Router();

router.route("/").post(isVerifiedUser, addOrder);
router.route("/").get(isVerifiedUser, getOrders);
router.route("/popular").get(isVerifiedUser, getMostOrderedItems);
router.route("/dashboard/cashier").get(isVerifiedUser, getEarningAndTotalOrder);
router.route("/dashboard/admin").get(isVerifiedUser, getOwnerDashboardStats);
router.route("/:id").get(isVerifiedUser, getOrderById);
router.route("/:id").put(isVerifiedUser, updateOrder);
 
module.exports = router;

