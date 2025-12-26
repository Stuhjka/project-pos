const mongoose = require("mongoose");

const dishSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  // 👇 FIELD TAMBAHAN DARI CONSTANTS
  image: {
    type: String, 
    default: "" // Nanti isinya URL gambar
  },
  rating: {
    type: Number,
    default: 4.5 // Default rating biar gak nol
  },
  description: {
    type: String,
    default: ""
  },
  // Relasi ke Category
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category", 
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Dish", dishSchema);