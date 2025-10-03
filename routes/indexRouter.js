const { Router } = require('express');
const controller = require('../controllers/indexController');

const router = Router();

router.get('/register', controller.registerGet);

module.exports = router;
