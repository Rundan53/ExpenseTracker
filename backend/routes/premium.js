const express = require('express');
const router = express.Router();

const premiumFeaturesController = require('../controllers/premiumFeatures');

router.get('/premium-status', premiumFeaturesController.premiumStatus)

router.get('/get-leaderboard', premiumFeaturesController.getLeaderboard)






module.exports = router;