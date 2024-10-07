// routes/chat.js
const express = require("express");
const router = express.Router();
const Message = require("../models/message");
const authMiddleware = require("../middleware/auth");

// 获取用户之间的消息
router.get("/:userId", authMiddleware, async (req, res) => {
  try {
    const messages = await Message.findBetweenUsers(
      req.user.id,
      req.params.userId
    );
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 发送消息
router.post("/:userId", authMiddleware, async (req, res) => {
  try {
    const message = await Message.create({
      content: req.body.content,
      sender_id: req.user.id,
      receiver_id: req.params.userId,
    });
    res.json({ message: "消息已发送", messageData: message });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
