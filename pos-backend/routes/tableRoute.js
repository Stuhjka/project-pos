const express = require('express');
const { addTable, getTables, updateTable, deleteTable } = require('../controllers/tableController');
const { isVerifiedUser } = require('../middleware/tokenVerification');
const router = express.Router();

router.route('/').post(isVerifiedUser , addTable);
router.route('/').get(isVerifiedUser , getTables);
router.route('/:id').put(isVerifiedUser , updateTable);
router.delete("/:id", deleteTable);

module.exports = router;