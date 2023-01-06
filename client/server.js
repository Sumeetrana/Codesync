const http = require('http');
const express = require('express');
const { Server } = require('socket.io');

const ACTIONS = require('./src/Actions');

const app = express();
const server = http.createServer(app);

const userSocketMap = {};

const io = new Server(server);

io.on('connection', (socket) => {
  console.log('socket connection: ', socket.id);

  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId);
  })
})

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
})