import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use('/api/auth', authRoutes);

app.get('/api', (req,res) => {
    res.send({message:"Welcome to the Courier API!"});
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});