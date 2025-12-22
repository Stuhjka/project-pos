const createHttpError = require("http-errors");
const User = require("../models/userModel"); 
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

const register = async (req, res, next) => {
    try {
        const { name, phone, email, password, role } = req.body;

        // 1. Validasi Input Kosong
        if (!name || !phone || !email || !password || !role) {
            const error = createHttpError(400, "All fields are required");
            return next(error);
        }

        // 2. Cek User Duplikat
        const isUserPresent = await User.findOne({email});
        if (isUserPresent) {
            const error = createHttpError(409, "User already exists");
            return next(error);
        }

        // 3. Simpan User
        const user = { name, phone, email, password, role };
        const newUser = new User(user);
        await newUser.save();

        res.status(201).json({success: true, message: "New user registered successfully", data: newUser});

    } catch (error) {
        next(error);
    }
}


const login = async (req, res, next) => {
    try {
        const { email, password} = req.body;

        if (!email || !password) {
            const error = createHttpError(400, "All fields are required");
            return next(error);
        }

        const isUserPresent = await User.findOne({email});
        if(!isUserPresent){
            const error = createHttpError(401, "Invalid credentials"); 
            return next(error); 
        }

        const isMatch = await bcrypt.compare(password, isUserPresent.password);
        if(!isMatch){
            const error = createHttpError(401, "Invalid credentials");
            return next(error);
        }

        const accessToken = jwt.sign({_id: isUserPresent._id}, config.accessTokenSecret, {expiresIn: "1d"});

        res.cookie('accessToken', accessToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30, // 30 hari
            httpOnly: true,
            
            // 👇 PERBAIKAN PENTING:
            // Kalau production (online) pake 'none', tapi kalau localhost pake 'lax'
            sameSite: config.nodeEnv === 'production' ? 'none' : 'lax',
            
            // Secure cuma true kalau production
            secure: config.nodeEnv === 'production'
        });

        // 👇 PERUBAHAN 1: Hapus password dari object user sebelum dikirim
        // Jadi pas login sukses, password hash gak bakal muncul di Postman
        isUserPresent.password = undefined;

        res.status(200).json({success: true, message: "User Logged in succesfully", data: isUserPresent})

    } catch (error) {
        next(error);
    }
}

const getUserData = async (req, res, next) => {
    try {
        // 👇 PERUBAHAN 2: Tambahin .select("-password")
        // Artinya: "Tolong cari user berdasarkan ID, TAPI kolom password JANGAN DIBAWA"
        // Tanda minus (-) artinya exclude/buang.
        const user = await User.findById(req.user._id).select("-password");
        
        res.status(200).json({success: true, data: user});

    } catch (error) {
        next(error);
    }
}

const logout = async (req, res, next) => {
    try {
        
        res.clearCookie('accessToken');
        res.status(200).json({ success: true, message: "User logout successfully!"});

    } catch (error) {
        next(error);
    }
}

module.exports = { register, login, getUserData, logout };