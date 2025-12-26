const createHttpError = require("http-errors");
const Payment = require("../models/paymentModel");
const mongoose = require("mongoose"); // ✅ Udah ada, aman.

const createPayment = async (req, res, next) => {
  try {
        const payment = req.body.payload.payment.entity;
        console.log(`💰 Payment Captured: ${payment.amount / 100} INR`);

        // Add Payment Details in Database
        const newPayment = new Payment({
          paymentId: payment.id,
          orderId: payment.order_id,
          amount: payment.amount / 100,
          currency: payment.currency,
          status: payment.status,
          method: payment.method,
          email: payment.email,
          contact: payment.contact,
          createdAt: new Date(payment.created_at * 1000) 
        });

        await newPayment.save();
      

      res.json({ success: true });

  } catch (error) {
    next(error);
  }
};

module.exports = { createPayment };
