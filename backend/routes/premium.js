const express = require('express');
const router = express.Router();

const premiumFeaturesController = require('../controllers/premiumFeatures');

router.get('/premium-status', premiumFeaturesController.premiumStatus)

router.get('/get-leaderboard', premiumFeaturesController.getLeaderboard)

router.get('/download', premiumFeaturesController.downloadExpense);

router.get('/get-history', premiumFeaturesController.getFileUrl)



module.exports = router;