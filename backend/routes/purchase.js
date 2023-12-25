const express = require('express')
const router = express.Router();

const auth = require('../middlewares/auth')

const purchaseController = require('../controllers/purchase')

router.get('/premium', auth.authenticate, purchaseController.purchasePremium);
router.post('/updateTransactionStatus', auth.authenticate, purchaseController.updateStatus)

module.exports = router;