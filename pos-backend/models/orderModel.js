const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    customerDetails: {
        name: { type: String, required: true},
        phone: { type: String, required: true},
        guest: { type: Number, required: true},
    },
    orderStatus: {
        type: String,
        required: true,
        default: "In Progress" // Gw kasih default biar aman
    },
    orderDate: {
        type: Date,
        required: true,
        default: Date.now // 👈 PERBAIKAN: JANGAN PAKE ()
    },
    bills: {
        total: {type: Number, required: true},
        tax: {type: Number, default: 0},
        totalWithTax: {type: Number, default: 0}
    },
    items: [], // Array Mixed (Bisa nampung object apa aja dari Redux)
    paymentMethod: { type: String, required: true },
    table: { type: mongoose.Schema.Types.ObjectId, ref: 'Table' }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);