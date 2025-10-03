const { Router } = require('express');
const controller = require('../controllers/indexController');
const passport = require('passport');

const router = Router();

router.get('/register', controller.registerGet);
router.post('/register', controller.registerPost);
router.get('/login', controller.loginGet);
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
  })
);
router.get('/', controller.indexGet);
router.get('/newmessage', controller.newMessageGet);

module.exports = router;
