const pool = require('./pool');

module.exports = {
  addUser: async (firstName, lastName, username, password) => {
    await pool.query(
      `INSERT INTO users(first_name, last_name, username, password)
          VALUES ($1, $2, $3, $4)`,
      [firstName, lastName, username, password]
    );
  },
  getUserByUsername: async (username) => {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    return rows;
  },
  getUserById: async (id) => {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [
      id,
    ]);
    return rows;
  },
};
