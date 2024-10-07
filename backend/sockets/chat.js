// sockets/chat.js
const socketio = require('socket.io');

function chatSocket(server) {
  const io = socketio(server);
  io.on('connection', (socket) => {
    console.log('用户已连接');

    socket.on('join', (room) => {
      socket.join(room);
      console.log(`用户加入了房间 ${room}`);
    });

    socket.on('message', (data) => {
      io.to(data.room).emit('message', data.message);
    });

    socket.on('disconnect', () => {
      console.log('用户已断开连接');
    });
  });
}

module.exports = chatSocket;