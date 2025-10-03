const { Pool } = require('pg');
require('dotenv').config();

let pool;
if (process.env.MODE === 'dev') {
  pool = new Pool({
    connectionString: process.env.LOCAL_DB_URI,
  });
} else if (process.env.MODE === 'prod') {
  pool = new Pool({
    connectionString: process.env.DB_URI,
  });
}

module.exports = pool;
