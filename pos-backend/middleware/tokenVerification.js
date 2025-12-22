const jwt = require("jsonwebtoken");
const createHttpError = require("http-errors");
const User = require("../models/userModel");
const config = require("../config/config");

const isVerifiedUser = async (req, res, next) => {
    try {
        // Ambil token dari cookies
        const { accessToken } = req.cookies;

        // 1. Cek ada token gak?
        if (!accessToken) {
            const error = createHttpError(401, "Unauthorized access, token missing (Please login first)");
            return next(error); 
        }

        // 2. Cek token asli atau palsu?
        // Pastikan nama variabelnya konsisten (decoded)
        const decoded = jwt.verify(accessToken, config.accessTokenSecret);

        // 3. Cari user pemilik token
        const user = await User.findById(decoded._id);
        
        if (!user) {
            const error = createHttpError(401, "Unauthorized access, user not found");
            return next(error); // WAJIB RETURN
        }

        // 4. Tempel data user ke request biar bisa dipake di controller lain
        req.user = user;
        next();

    } catch (error) {
        const err = createHttpError(401, "Unauthorized access, invalid token");
        next(err);
    }
}

module.exports = { isVerifiedUser };