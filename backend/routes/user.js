const express = require('express');
const router = express.Router();

const userControllers = require('../controllers/user')

router.post('/sign-up', userControllers.postUser);



module.exports = router;