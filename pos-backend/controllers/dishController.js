const Dish = require("../models/dishModel");
const createHttpError = require("http-errors"); 

// 1. ADD DISH (CREATE)
const addDish = async (req, res, next) => {
    try {
        const { title, price, description, category, rating } = req.body;
        
        // Logic Gambar
        let imageUrl = "https://placehold.co/600x400?text=No+Image"; 
        
        if (req.file && req.file.path) {
            imageUrl = req.file.path; 
        }

        const dish = new Dish({ 
            title, 
            price, 
            description, 
            category,
            image: imageUrl, 
            rating: rating || 4.5 
        });
        
        await dish.save();
        res.status(201).json({ success: true, message: "Dish added!", data: dish });
    } catch (error) {
        next(error);
    }
}

// 2. GET DISHES (READ)
const getDishes = async (req, res, next) => {
    try {
        const dishes = await Dish.find().populate("category");
        res.status(200).json({ success: true, data: dishes });
    } catch (error) {
        next(error);
    }
}

// 3. DELETE DISH (DELETE)
const deleteDish = async (req, res, next) => {
    try {
        const { id } = req.params;
        const dish = await Dish.findByIdAndDelete(id);
        
        if(!dish) {
            const error = createHttpError(404, "Dish not found");
            return next(error);
        }
        res.status(200).json({ success: true, message: "Dish deleted!" });
    } catch (error) {
        next(error);
    }
}

// 4. UPDATE DISH (UPDATE - BARU DITAMBAHIN) 👇
const updateDish = async (req, res, next) => {
    try {
        const { id } = req.params;
        // Ambil data yang mau diupdate dari body (price, title, description, dll)
        const updateData = req.body; 

        // Opsi { new: true } biar yang dikembaliin data sesudah diedit
        const dish = await Dish.findByIdAndUpdate(id, { $set: updateData }, { new: true });

        if(!dish) {
            const error = createHttpError(404, "Dish not found");
            return next(error);
        }

        res.status(200).json({ 
            success: true, 
            message: "Dish updated successfully!", 
            data: dish 
        });
    } catch (error) {
        next(error);
    }
}

// JANGAN LUPA UPDATE EXPORTNYA JUGA 👇
module.exports = { addDish, getDishes, deleteDish, updateDish };