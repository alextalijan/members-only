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
    const { rows } = await pool.query(
      'SELECT id, username, membership_status AS member, admin FROM users WHERE id = $1',
      [id]
    );
    return rows;
  },
  getAllMessages: async () => {
    const { rows } = await pool.query(
      `SELECT messages.id AS id, username, title, text, timestamp
        FROM users JOIN messages ON users.id = messages.user_id`
    );
    return rows;
  },
  addMessage: async (userId, title, text) => {
    await pool.query(
      `INSERT INTO messages(user_id, title, text)
      VALUES ($1, $2, $3)`,
      [userId, title, text]
    );
  },
  makeUserMember: async (id) => {
    await pool.query(
      `UPDATE users SET membership_status = TRUE
        WHERE id = $1`,
      [id]
    );
  },
  makeUserAdmin: async (id) => {
    await pool.query(
      `UPDATE users SET admin = TRUE
        WHERE id = $1`,
      [id]
    );
  },
  deleteMessage: async (id) => {
    await pool.query('DELETE FROM messages WHERE id = $1', [id]);
  },
};
