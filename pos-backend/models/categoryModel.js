const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  // 👇 INI FIELD DARI CONSTANTS LU
  bgColor: {
    type: String,
    default: "#1f1f1f" // Default warna gelap kalo lupa ngisi
  },
  icon: {
    type: String,
    default: "🍽️" // Default icon sendok garpu
  }
}, { timestamps: true });

module.exports = mongoose.model("Category", categorySchema);