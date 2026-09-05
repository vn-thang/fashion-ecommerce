const { Server } = require('socket.io');
const socketAuth = require('./socket.auth');
const registerChatSocket = require('./chat.socket');

const initSocket = (server) => {
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  process.env.FRONTEND_URL,
].filter(Boolean);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

  io.use(socketAuth);

  io.on('connection', (socket) => {
    console.log(
      `Socket connected: ${socket.id} - User: ${socket.user.userId}`
    );

    registerChatSocket(io, socket);

    socket.on('disconnect', (reason) => {
      console.log(
        `Socket disconnected: ${socket.id} - ${reason}`
      );
    });
  });

  return io;
};

module.exports = initSocket;