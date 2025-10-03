const { Router } = require('express');
const controller = require('../controllers/indexController');
const passport = require('passport');

const router = Router();

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/login');
}

router.get('/register', controller.registerGet);
router.post('/register', controller.registerPost);
router.get('/login', controller.loginGet);
router.post('/login', controller.loginPost);
router.get('/', controller.indexGet);
router.get('/newmessage', isAuthenticated, controller.newMessageGet);
router.post('/newmessage', isAuthenticated, controller.newMessagePost);
router.get('/logout', isAuthenticated, controller.logoutGet);
router.get('/joinclub', isAuthenticated, controller.joinClubGet);
router.post('/joinclub', isAuthenticated, controller.joinClubPost);
router.get('/admin', isAuthenticated, controller.adminGet);
router.post('/admin', isAuthenticated, controller.adminPost);
router.get(
  '/deletemessage/:messageId',
  isAuthenticated,
  controller.deleteMessage
);

module.exports = router;
