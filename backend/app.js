// app.js
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const chatSocket = require("./sockets/chat");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

// 中间件
app.use(cors());
app.use(bodyParser.json());

// 路由
const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/projects");
const forumRoutes = require("./routes/forum");
const userRoutes = require("./routes/user");
const chatRoutes = require("./routes/chat");

app.use("/auth", authRoutes);
app.use("/projects", projectRoutes);
app.use("/forum", forumRoutes);
app.use("/user", userRoutes);
app.use("/chat", chatRoutes);

// Socket.io
chatSocket(http);

// 数据库表创建（为简化流程）
const pool = require("./db");

async function createTables() {
  try {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                student_id VARCHAR(20) UNIQUE NOT NULL,  -- 学号
                name VARCHAR(100) ,               -- 姓名     
                major VARCHAR(100),                        -- 专业
                grade VARCHAR(10),                         -- 年级
                phone VARCHAR(15),                         -- 手机号
                email VARCHAR(100) UNIQUE,                -- 邮箱
                password VARCHAR(255) NOT NULL            -- 密码
            );

      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        description TEXT,
        owner_id INTEGER REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS project_members (
        id SERIAL PRIMARY KEY,
        project_id INTEGER REFERENCES projects(id),
        user_id INTEGER REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        content TEXT,
        author_id INTEGER REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        content TEXT,
        sender_id INTEGER REFERENCES users(id),
        receiver_id INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("数据库表创建成功");
  } catch (err) {
    console.error("创建数据库表时出错", err);
  }
}

createTables();

const PORT = process.env.PORT || 3826;
http.listen(PORT, () => {
  console.log(`服务器正在运行，端口号为 ${PORT}`);
});
