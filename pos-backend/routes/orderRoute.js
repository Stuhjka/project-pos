const express = require("express");
const { addOrder, getOrders, getOrderById, updateOrder, getMostOrderedItems } = require("../controllers/orderController");
const { isVerifiedUser } = require("../middleware/tokenVerification");
const router = express.Router();

router.route("/").post(isVerifiedUser, addOrder);
router.route("/").get(isVerifiedUser, getOrders);
router.route("/popular").get(isVerifiedUser, getMostOrderedItems);
router.route("/:id").get(isVerifiedUser, getOrderById);
router.route("/:id").put(isVerifiedUser, updateOrder);
 
module.exports = router;

