const { default: mongoose } = require("mongoose");
const Category = require("../models/categoryModel");
const Dish = require("../models/dishModel")
const createHttpError = require("http-errors"); // 👈 Wajib ada buat handle error

const addCategory = async (req, res, next) => {
    try {
        const { title, bgColor, icon } = req.body;

        console.log("Body :", req.body);

        const category = new Category({
            title,
            bgColor,
            icon
        });

        await category.save();
        res.status(201).json({ success: true, message: "Category added!", data: category });
    } catch (error) {
        console.log("Error : ", error);
        next(error);
    }
}

const getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find();
        res.status(200).json({ data: categories });
    } catch (error) {
        next(error);
    }
}

// 👇 FITUR BARU: DELETE CATEGORY
const deleteCategory = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(createHttpError(400, "Invalid category id"));
        }

        const category = await Category.findById(id);
        if (!category) {
            return next(createHttpError(404, "Category not found"));
        }

        // delete dishes referencing this category
        await Dish.deleteMany({ category: id });

        // delete the category itself
        await Category.findByIdAndDelete(id);

        res.status(200).json({ success: true, message: "Category deleted!" });
    } catch (error) {
        next(error);
    }
}

module.exports = { addCategory, getCategories, deleteCategory };