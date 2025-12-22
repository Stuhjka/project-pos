const config = require("../config/config");

const globalErrorHandler = (err, req, res, next) => {
    
    // Default status code
    let statusCode = err.statusCode || 500;
    let message = err.message;

    // 👇 TAMBAHAN: Cek apakah errornya dari Validasi Mongoose/MongoDB?
    // Kalau user masukin format email salah atau no HP kependekan, Mongoose errornya namanya "ValidationError"
    if (err.name === 'ValidationError') {
        statusCode = 400; // Ubah jadi Bad Request
        // Biar pesannya lebih rapi (ambil pesan pertama aja)
        message = Object.values(err.errors).map(val => val.message)[0];
    }

    return res.status(statusCode).json({
        status: statusCode,
        message: message,
        errorStack: config.nodeEnv === "development" ? err.stack : ""
    });
}

module.exports = globalErrorHandler;