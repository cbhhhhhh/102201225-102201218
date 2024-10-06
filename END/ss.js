// app.js
const express = require("express");
const app = express();
const port = 8982;

// 定义一个路由，当访问根目录时返回 'Hello, World!'
app.get("/", (req, res) => {
  // 假设客户端发送的数据是 JSON 格式
  const data = req.body;

  // 将接收到的数据发送回客户端
  res.send(data);
});

app.get("/a/b", (req, res) => {
  res.send("Hello, LIUYU!");
});

// 启动服务器
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
