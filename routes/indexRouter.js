const { Router } = require('express');
const controller = require('../controllers/indexController');

const router = Router();

router.get('/register', controller.registerGet);
router.post('/register', controller.registerPost);

module.exports = router;
