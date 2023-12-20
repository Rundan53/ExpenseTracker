const express = require('express');
const router = express.Router();

const userControllers = require('../controllers/user')

router.post('/sign-up', userControllers.signUp);

router.post('/log-in' , userControllers.login)


module.exports = router;