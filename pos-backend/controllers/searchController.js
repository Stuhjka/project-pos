const Dish = require("../models/dishModel");
const Order = require("../models/orderModel");
const Category = require("../models/categoryModel");

// Helper untuk dapetin batas waktu WIB (GMT+7) hari ini
// Copas dari orderController biar konsisten reset jam 12 malem
const getWIBBoundaries = (offsetDays = 0) => {
    const now = new Date();
    const wibNow = new Date(now.getTime() + (7 * 60 * 60 * 1000));
    wibNow.setDate(wibNow.getDate() + offsetDays);
    wibNow.setUTCHours(0, 0, 0, 0); 
    
    const startUTC = new Date(wibNow.getTime() - (7 * 60 * 60 * 1000));
    const endUTC = new Date(startUTC.getTime() + (24 * 60 * 60 * 1000) - 1);
    
    return { startUTC, endUTC };
};

const globalSearch = async (req, res, next) => {
    try {
        const { q } = req.query;
        if (!q) return res.status(200).json({ success: true, data: { dishes: [], orders: [], categories: [] } });

        const searchRegex = new RegExp(q, 'i');
        
        // Ambil batas waktu hari ini (Start: 00:00 WIB, End: 23:59 WIB)
        const { startUTC, endUTC } = getWIBBoundaries(0);

        // Nyari di 3 tabel sekaligus secara paralel
        const [dishes, orders, categories] = await Promise.all([
            // 1. Cari Menu (Global, gak pake batas waktu)
            Dish.find({ title: searchRegex }).limit(5),

            // 2. Cari Order (DIBATASI HANYA HARI INI)
            Order.find({ 
                "customerDetails.name": searchRegex,
                createdAt: { $gte: startUTC, $lte: endUTC } // 👈 Filter sakti hari ini
            }).limit(5).sort({ createdAt: -1 }),

            // 3. Cari Kategori (Global)
            Category.find({ title: searchRegex }).limit(5)
        ]);

        res.status(200).json({
            success: true,
            data: { dishes, orders, categories }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { globalSearch };