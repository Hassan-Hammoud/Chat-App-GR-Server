import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import { connectDB } from './lib/db.js';
dotenv.config();

// * CREATE EXPRESS APP AND HTTP SERVER

const app = express();
const server = http.createServer(app);

// * MIDDLEWARE setup
app.use(express.json({ limit: '4mb' }));
app.use(cors());

app.use('/api/status', (req, res) => res.send('Server is live'));

// * CONNECT TO MONGODB

await connectDB();
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log('Server is running on PORT: ' + PORT));
