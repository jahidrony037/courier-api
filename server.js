import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io'; // Correct import for Socket.IO
import connectDB from './config/db.js';
import adminRoutes from './routes/admin.routes.js';
import authRoutes from './routes/auth.routes.js';
import parcelRoutes from './routes/parcel.routes.js';

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);  // Create HTTP server with Express

// Setting up Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",  // Frontend URL (make sure this matches your frontend port)
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Allow credentials (cookies, headers)
  }
});

// Exporting io to use it in controllers if needed
export { io };

const port = process.env.PORT || 3000;

// CORS middleware configuration for HTTP requests
app.use(cors({
  origin: "http://localhost:5173", // Frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],  // Allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  credentials: true,  // Allow credentials (cookies, authorization headers)
}));

// Middleware to parse the request body
app.use(express.json());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/parcel', parcelRoutes);
app.use('/api/admin', adminRoutes);

// Socket.IO: Listen for events and emit messages
io.on('connection', (socket) => {
  console.log('A user connected');

  // Emit a message when a user connects (optional)
  socket.emit('welcome', { message: 'Welcome to real-time parcel tracking!' });

  // Listen for parcel status changes
  socket.on('trackParcel', (parcelId) => {
    console.log(`Tracking parcel with ID: ${parcelId}`);
    // Emit status change to the specific client who requested it (you can replace this logic)
    socket.emit('parcelStatusUpdate', { parcelId, status: 'In Transit' });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Sample test route to check the API
app.get('/api', (req, res) => {
  res.send({ message: "Welcome to the Courier API!" });
});

// Starting the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
