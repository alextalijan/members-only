const pool = require('./pool');

module.exports = {
  addUser: async (firstName, lastName, username, password) => {
    try {
      await pool.query(
        `INSERT INTO users(first_name, last_name, username, password)
          VALUES ($1, $2, $3, $4)`,
        [firstName, lastName, username, password]
      );
    } catch (err) {
      console.error(err);
    }
  },
  getUserByUsername: async (username) => {
    try {
      const { rows } = await pool.query(
        'SELECT * FROM users WHERE username = $1',
        [username]
      );
      return rows;
    } catch (err) {
      console.error(err);
    }
  },
};
