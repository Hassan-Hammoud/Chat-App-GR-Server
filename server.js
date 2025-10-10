import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { connectDB } from './lib/db.js';
import messageRouter from './routes/messageRoutes.js';
import userRouter from './routes/userRoutes.js';
// import { io } from './server';
dotenv.config();

// * CREATE EXPRESS APP AND HTTP SERVER

const app = express();
const server = http.createServer(app);

// INITIALIZE SOCKET.IO SERVER
export const io = new Server(server, {
  cors: {
    origin: ['https://chat-app-gr.vercel.app'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// STORE ONLINE USERS
export const userSocketMap = {}; // {userId: socketId}

// SOCKET.IO CONNECTION HANDLER

io.on('connection', socket => {
  const userId = socket.handshake.query.userId;
  console.log('🚀 ~ User Connected, UserId:', userId);

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  // EMIT ONLINE USERS TO ALL CONNECTED CLIENT
  io.emit('getOnlineUsers', Object.keys(userSocketMap));

  socket.on('disconnect', () => {
    console.log('🚀 ~ User Disconnected', userId);
    delete userSocketMap[userId];
    io.emit('getOnlineUsers', Object.keys(userSocketMap));
  });
});

// * MIDDLEWARE setup
app.use(express.json({ limit: '4mb' }));
app.use(cors());

// * ROUTES SETUP
app.use('/api/status', (req, res) => res.send('Server is live'));
app.use('/api/auth', userRouter);
app.use('/api/messages', messageRouter);

// await connectDB();
// if (process.env.NODE_ENV !== 'production') {
//   const PORT = process.env.PORT || 3000;

//   server.listen(PORT, () => console.log('Server is running on PORT: ' + PORT));
// } // ! this is use it in vercel backend deployment

// * CONNECT TO MONGODB
await connectDB();

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log('🚀 Server running on PORT: ' + PORT)); // ! this is use it in render backend deployment

// EXPORT SERVER FOR VERCEL
export default server;
