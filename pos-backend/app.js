require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const config = require("./config/config");
const globalErrorHandler = require("./middleware/globalErrorHandler");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors"); // 👈 1. IMPORT INI
const categoryRoutes = require("./routes/categoryRoute");
const dishRoutes = require("./routes/dishRoute");

// Middleware 
// 👇 2. PASANG INI (PENTING BANGET!)
app.use(cors({
    origin: "http://localhost:5173", // Alamat Frontend (Vite)
    credentials: true // Biar Cookie Token boleh lewat
}));

app.use(express.json()); 
app.use(cookieParser());

const PORT = process.env.PORT || 8000; // Tambah fallback biar aman
connectDB();

//Root Endpoint
app.get("/", (req,res) => {
    res.json({message : "Hello from POS Server!"});
})

//Other Endpoints
app.use("/api/user", require("./routes/userRoute"));
app.use("/api/order", require("./routes/orderRoute"));
app.use("/api/table", require("./routes/tableRoute"));
app.use("/api/category", categoryRoutes);
app.use("/api/dish", dishRoutes);

// Global Error Handler 
app.use(globalErrorHandler)

app.listen(PORT, () => {
    console.log(`POS Server is listening on port ${PORT}`);
})

