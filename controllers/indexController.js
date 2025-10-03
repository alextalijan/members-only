const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const db = require('../db/queries.js');

const registerValidations = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('You must provide first name.')
    .isLength({ max: 20 })
    .withMessage('First name cannot exceed 20 characters.'),
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('You must provide last name.')
    .isLength({ max: 20 })
    .withMessage('Last name cannot exceed 20 characters.'),
  body('username')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Username must be between 3 and 20 characters.')
    .custom((value) => {
      if (/\s/.test(value)) {
        return false;
      }

      return true;
    })
    .withMessage('Username cannot contain any spaces.'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password field cannot be empty.')
    .isLength({ max: 50 })
    .withMessage('Password cannot exceed 50 characters.')
    .custom((value) => {
      if (/\s/.test(value)) {
        return false;
      }

      return true;
    })
    .withMessage('Password cannot contain any spaces.'),
  body('passwordConfirmation')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        return false;
      }

      return true;
    })
    .withMessage('Password and confirmation do not match.'),
];

module.exports = {
  registerGet: (req, res) => {
    res.render('register', { errors: null });
  },
  registerPost: [
    registerValidations,
    async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.locals.inputs = {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          username: req.body.username,
          password: req.body.password,
          passwordConfirmation: req.body.passwordConfirmation,
        };
        return res.render('register', { errors: errors.array() });
      }

      // Capture and clean user input
      const firstName = req.body.firstName.trim();
      const lastName = req.body.lastName.trim();
      const username = req.body.username.trim().toLowerCase();

      let password;
      try {
        password = await bcrypt.hash(req.body.password, 10);
      } catch (err) {
        return next(new Error('Error hashing the password. Please try again.'));
      }

      // Insert the user into the database
      await db.addUser(firstName, lastName, username, password);

      res.redirect('/login');
    },
  ],
};
