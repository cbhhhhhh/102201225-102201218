// models/user.js
const pool = require("../db");
const bcrypt = require("bcrypt");

const User = {
  async register(user) {
    const hash = await bcrypt.hash(user.password, 10);
    const result = await pool.query(
      "INSERT INTO users (student_id, password) VALUES ($1, $2) RETURNING *",
      [user.student_id, hash]
    );
    return result.rows[0];
  },

  async login(student_id, password) {
    const result = await pool.query(
      "SELECT * FROM users WHERE student_id = $1",
      [student_id]
    );
    const user = result.rows[0];
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    throw new Error("Invalid credentials");
  },

  async findById(id) {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    return result.rows[0];
  },

  async update(user) {
    const result = await pool.query(
      "UPDATE users SET name = $1, major = $2, grade = $3, phone = $4, email = $5 WHERE id = $6 RETURNING *",
      [user.name, user.major, user.grade, user.phone, user.email, user.id]
    );
    return result.rows[0];
  },
};

module.exports = User;
