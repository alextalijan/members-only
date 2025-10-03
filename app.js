const express = require('express');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const localStrategy = require('passport-local').Strategy;
const db = require('./db/queries');
const bcrypt = require('bcryptjs');
const pool = require('./db/pool');
const pgSession = require('connect-pg-simple')(session);
require('dotenv').config();

const indexRouter = require('./routes/indexRouter');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up views folder to keep all the pages
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Allow express to store and use form inputs
app.use(express.urlencoded({ extended: true }));

// Set up express session and passport to track sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new pgSession({
      pool: pool,
      tableName: 'sessions',
    }),
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in miliseconds
      secure: process.env.MODE === 'prod', // Ensures cookies only go over HTTPS
      httpOnly: true, // Prevents JavaScript from reading cookies
      sameSite: 'lax', // Helps protect against CSRF
    },
  })
);

passport.use(
  new localStrategy(async function (username, password, done) {
    // Find the user in the database
    let user;
    try {
      [user] = await db.getUserByUsername(username);
    } catch (err) {
      return done(err);
    }

    if (!user) {
      return done(null, false, {
        message: 'User not found.',
      });
    }
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return done(null, false, {
        message: 'Incorrect password.',
      });
    }

    return done(null, user);
  })
);

app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const [user] = await db.getUserById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Set the user automatically to locals when it exists
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.use(indexRouter);
app.use((err, req, res, next) => {
  res.status(500).render('error', { error: err });
});

app.listen(PORT, (err) => {
  if (err) {
    console.error(err);
  }

  console.log('App listening to requests on port ' + PORT + '.');
});

module.exports = app;
