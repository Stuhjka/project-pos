const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    customerDetails: {
        name: { type: String, required: true},
        phone: { type: String, required: true},
        guest: {type: Number, required: true},
    },
    orderStatus: {
        type: String,
        required: true,
    },
    orderDate: {
        type: Date,
        required: true,
        default: Date.now()
    },
    bills: {
        total: {type: Number, required: true}
    },
    items: [],
    paymentMethod: String,
    table: {type: mongoose.Schema.Types.ObjectId, ref: 'Table'}
}, { timestamps: true } );

module.exports = mongoose.model("Order", orderSchema);