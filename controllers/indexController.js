const { body, validationResult } = require('express-validator');

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
    .isEmpty()
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
];

module.exports = {
  registerGet: (req, res) => {
    res.render('register');
  },
  registerPost: (req, res) => {},
};
