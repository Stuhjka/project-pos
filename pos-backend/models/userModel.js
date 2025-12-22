const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    
    email: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /\S+@\S+\.\S+/.test(v);
            },
            message : "Email must be in valid format"
        }
    },

    phone: {
        type: String, 
        required: true,
        trim: true, 
        validate: {
            validator: function (v) {
                // Regex: Angka 0-9, panjang 10-13 digit
                return /^[0-9]{10,13}$/.test(v);
            },
            message : "Phone number must be valid (10-13 digits)"
        }
    },

    password: {
        type: String,
        required: true,
    },

    role: {
        type: String,
        required: true,
    }
}, { timestamps: true })

// 👇 INI BAGIAN YANG SUDAH DI-FIX
userSchema.pre('save', async function (next) {
    // 1. Cek kalau password gak berubah, langsung skip (pake return)
    if(!this.isModified('password')){
        return next();
    }

    try {
        // 2. Proses hashing password
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        
        // 3. Panggil next() biar proses simpan dilanjutin sama Mongoose
        next();
    } catch (error) {
        // Kalau error, lempar ke middleware berikutnya
        next(error);
    }
})

module.exports = mongoose.model("User", userSchema);