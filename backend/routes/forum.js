// routes/forum.js
const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const authMiddleware = require("../middleware/auth");

// 创建帖子
router.post("/", authMiddleware, async (req, res) => {
  try {
    const post = await Post.create({
      ...req.body,
      author_id: req.user.id,
    });
    res.json({ message: "帖子创建成功", post });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 获取所有帖子
router.get("/", async (req, res) => {
  try {
    const posts = await Post.findAll();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
