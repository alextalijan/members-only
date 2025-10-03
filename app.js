const express = require('express');
const path = require('path');

const indexRouter = require('./routes/indexRouter');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up views folder to keep all the pages
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Allow express to store and use form inputs
app.use(express.urlencoded({ extended: true }));

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
