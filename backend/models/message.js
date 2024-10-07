// models/message.js
const pool = require("../db");

const Message = {
  async create(message) {
    const result = await pool.query(
      "INSERT INTO messages (content, sender_id, receiver_id) VALUES ($1, $2, $3) RETURNING *",
      [message.content, message.sender_id, message.receiver_id]
    );
    return result.rows[0];
  },

  async findBetweenUsers(user1_id, user2_id) {
    const result = await pool.query(
      `SELECT * FROM messages WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1) ORDER BY created_at`,
      [user1_id, user2_id]
    );
    return result.rows;
  },
};

module.exports = Message;
