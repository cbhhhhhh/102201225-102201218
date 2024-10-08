// routes/auth.js
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// 用户注册
router.post("/register", async (req, res) => {
  const { student_id, password } = req.body;
  try {
    if (!student_id || !password) {
      return res
        .status(400)
        .json({ error: "Student ID and password are required." });
    }

    const saltRounds = 10; // 定义盐的轮数
    const salt = await bcrypt.genSalt(saltRounds); // 生成盐
    const hashedPassword = await bcrypt.hash(password, salt); // 哈希密码

    const user = await User.register({
      student_id,
      password: hashedPassword, // 存储哈希后的密码
    });
    res.json({ message: "注册成功", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// //原始
// router.post("/register", async (req, res) => {
//   try {
//     const user = await User.register(req.body);
//     res.json({ message: "用户注册成功", user });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// //姓名必须且非空时
// router.post("/register", async (req, res) => {
//   const { student_id, password, name } = req.body; // 提取所有字段
//   try {
//     if (!name) {
//       return res.status(400).json({ error: "Name is required" }); // 处理缺少 name 的情况
//     }
//     const saltRounds = 10; // 定义盐的轮数
//     const salt = await bcrypt.genSalt(saltRounds);
//     const hashedPassword = await bcrypt.hash(password, salt); // 确保提供盐值

//     const user = await User.register({
//       student_id,
//       password: hashedPassword, // 存储哈希后的密码
//       name, // 确保将 name 字段包含在内
//     });
//     res.json({ message: "注册成功", user });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// 用户登录
router.post("/login", async (req, res) => {
  try {
    const user = await User.findByEmail(req.body.email);
    if (!user) return res.status(400).json({ message: "用户不存在" });

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) return res.status(400).json({ message: "密码错误" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.json({ message: "登录成功", token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// router.post("/login", async (req, res) => {
//   try {
//     // 确保请求体中有必要字段
//     const { student_id, password } = req.body;
//     if (!student_id || !password) {
//       return res.status(400).json({ message: "学号和密码是必填字段" });
//     }

//     const user = await User.login(req.body.student_id, req.body.password);
//     if (!user) return res.status(400).json({ message: "用户不存在" });

//     const isMatch = await bcrypt.compare(req.body.password, user.password);
//     if (!isMatch) return res.status(400).json({ message: "密码错误" });

//     const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

//     // 检查用户信息是否完整
//     if (!user.name || !user.major) {
//       return res.json({
//         message: "登录成功，信息完善",
//         token,
//         user: {
//           id: user.id,
//           student_id: user.student_id,
//           name: user.name, // 可以是空???
//           major: user.major, // 可以是空???
//         },
//         redirect: "/complete-profile", // 指向信息完善页面????
//       });
//     }

//     res.json({
//       message: "登录成功",
//       token,
//       user: {
//         id: user.id,
//         student_id: user.student_id,
//         name: user.name,
//         major: user.major,
//         grade: user.grade,
//         phone: user.phone,
//         email: user.email,
//         // 更多用户信息
//       },
//     });
//   } catch (err) {
//     // 处理未预料的错误
//     console.error("登录时发生错误:", err.message);
//     res.status(500).json({ message: "服务器错误" });
//   }
// });

module.exports = router;
