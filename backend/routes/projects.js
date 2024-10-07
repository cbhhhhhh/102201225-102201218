// routes/projects.js
const express = require("express");
const router = express.Router();
const Project = require("../models/project");
const authMiddleware = require("../middleware/auth");

// 创建项目
router.post("/", authMiddleware, async (req, res) => {
  try {
    const project = await Project.create({
      ...req.body,
      owner_id: req.user.id,
    });
    res.json({ message: "项目创建成功", project });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
 
// 获取所有项目
router.get("/", async (req, res) => {
  try {
    const projects = await Project.findAll();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 加入项目
router.post("/join/:id", authMiddleware, async (req, res) => {
  try {
    const membership = await Project.joinProject(req.params.id, req.user.id);
    res.json({ message: "成功加入项目", membership });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 获取用户的项目
router.get("/my-projects", authMiddleware, async (req, res) => {
  try {
    const projects = await Project.findByUserId(req.user.id);
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
