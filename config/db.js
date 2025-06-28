import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();
const MONGO_URI=`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@atlascluster.k7qynmg.mongodb.net/courierDB?retryWrites=true&w=majority&appName=AtlasCluster`;
 const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    // console.log('MongoDB Atlas Connected to courierDB');
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    process.exit(1);
  }
};

export default connectDB;


