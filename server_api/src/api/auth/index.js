const { Router } = require('express');
const { login } = require('./controller');
const password = require('../../middlewares/password');

const router = Router();

router.post('/',
    password,
    login
    );

module.exports = router;