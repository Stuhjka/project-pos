const express = require('express');
// 👇 UPDATE DISINI: Tambahin 'updateDish' di dalam kurung kurawal
const { addDish, getDishes, deleteDish, updateDish } = require('../controllers/dishController');

const upload = require('../config/cloudinary'); 

const router = express.Router();

// Pasang 'Satpam' upload disini
router.post("/", upload.single("image"), addDish);

router.get("/", getDishes);
router.delete("/:id", deleteDish);

// 👇 TAMBAHIN JALUR INI (Buat Edit Harga & Diskon)
router.put("/:id", updateDish);

module.exports = router;