// models/post.js
const pool = require("../db");

const Post = {
  async create(post) {
    const result = await pool.query(
      "INSERT INTO posts (title, content, author_id) VALUES ($1, $2, $3) RETURNING *",
      [post.title, post.content, post.author_id]
    );
    return result.rows[0];
  },

  async findAll() {
    const result = await pool.query("SELECT * FROM posts");
    return result.rows;
  },
};

module.exports = Post;
