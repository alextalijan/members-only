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
};
