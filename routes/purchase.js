const express = require('express');
const router = express.Router();

const purchaseController = require('../controllers/purchase');

router.get('/premium', purchaseController.purchasePremium);
router.post('/updateTransactionStatus', purchaseController.updateStatus);

module.exports = router;