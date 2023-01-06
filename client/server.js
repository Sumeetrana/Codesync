const http = require('http');
const express = require('express');
const { Server } = require('socket.io');

const ACTIONS = require('./src/Actions');

const app = express();
const server = http.createServer(app);

const userSocketMap = {};

const io = new Server(server);

function getAllConnectedClients(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId]
      }
    }
  )
}

io.on('connection', (socket) => {
  console.log('socket connection: ', socket.id);

  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId);
    const clients = getAllConnectedClients(roomId);
    console.log("Clients: ", clients);
  })
})

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
})