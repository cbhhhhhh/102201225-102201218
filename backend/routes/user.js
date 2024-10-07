// routes/user.js
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const authMiddleware = require("../middleware/auth");
const pool = require("../db");

// 获取用户信息
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 更新用户信息
router.put("/me", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      "UPDATE users SET name = $1, major = $2, grade = $3, phone = $4, email = $5 WHERE id = $6 RETURNING *",
      [
        req.body.name,
        req.body.major,
        req.body.grade,
        req.body.phone,
        req.body.email,
        req.user.id,
      ]
    );
    res.json({ message: "个人信息更新成功", user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
