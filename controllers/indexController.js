const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const db = require('../db/queries.js');
const passport = require('passport');
require('dotenv').config();

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

const newMessageValidations = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title must be provided.')
    .isLength({ max: 50 })
    .withMessage('Title cannot exceed 50 characters.'),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message cannot be empty.')
    .isLength({ max: 200 })
    .withMessage('Message cannot exceed 200 characters.'),
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

      // Make sure the username doesn't already exist
      const [user] = await db.getUserByUsername(
        req.body.username.trim().toLowerCase()
      );
      if (user) {
        return next(
          new Error('This username already exists. Please choose another one.')
        );
      }

      // Capture and clean user input
      const firstName = req.body.firstName.trim();
      const lastName = req.body.lastName.trim();
      const username = req.body.username.trim().toLowerCase();

      let password;
      try {
        password = await bcrypt.hash(req.body.password.trim(), 10);
      } catch (err) {
        return next(new Error('Error hashing the password. Please try again.'));
      }

      // Insert the user into the database
      await db.addUser(firstName, lastName, username, password);

      res.redirect('/login');
    },
  ],
  loginGet: (req, res) => {
    res.render('login', { errors: null });
  },
  loginPost: (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login',
    })(req, res, next);
  },
  indexGet: async (req, res, next) => {
    let messages;
    try {
      messages = await db.getAllMessages();
    } catch (err) {
      next(err);
    }
    res.render('index', { messages });
  },
  newMessageGet: async (req, res, next) => {
    res.render('newMessageForm', { errors: null });
  },
  newMessagePost: [
    newMessageValidations,
    async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.locals.inputs = {
          title: req.body.title,
          message: req.body.message,
        };
        res.render('newMessageForm', { errors: errors.array() });
      }

      // Add message into the database
      try {
        await db.addMessage(
          req.user.id,
          req.body.title.trim(),
          req.body.message.trim()
        );
      } catch (err) {
        return next(err);
      }

      res.redirect('/');
    },
  ],
  logoutGet: (req, res) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.redirect('/');
    });
  },
  joinClubGet: async (req, res, next) => {
    res.render('joinClubForm', { errors: null });
  },
  joinClubPost: async (req, res) => {
    if (req.body.password !== process.env.CLUB_PASSWORD) {
      return res.render('joinClubForm', {
        errors: [new Error('Secret password is incorrect.')],
      });
    }

    // Turn the user into a member
    try {
      await db.makeUserMember(req.user.id);
    } catch (err) {
      return next(err);
    }

    res.redirect('/');
  },
};
