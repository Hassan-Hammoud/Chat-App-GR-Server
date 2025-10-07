import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import { connectDB } from './lib/db.js';
import messageRouter from './routes/messageRoutes.js';
import userRouter from './routes/userRoutes.js';
dotenv.config();

// * CREATE EXPRESS APP AND HTTP SERVER

const app = express();
const server = http.createServer(app);

// * MIDDLEWARE setup
app.use(express.json({ limit: '4mb' }));
app.use(cors());

// * ROUTES SETUP
app.use('/api/status', (req, res) => res.send('Server is live'));
app.use('/api/auth', userRouter);
app.use('/api/messages', messageRouter);

// * CONNECT TO MONGODB

await connectDB();
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log('Server is running on PORT: ' + PORT));
// 3 hours and 10 mins
