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

    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients, // list of clients of current roomId
        username, // username of newly connected user
        socketId: socket.id // socket id of newly connected user
      })
    })
  })

  socket.on('disconnecting', () => {
    // getting all the rooms in which this socket is connected to
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      // socket.in() - inside a particular room
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id]
      });
    });
    delete userSocketMap[socket.id];
    socket.leave();
  })

  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    // emitting code-change event to particular roomId
    io.to(roomId).emit(ACTIONS.CODE_CHANGE, {
      code
    })
  })
})

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
})