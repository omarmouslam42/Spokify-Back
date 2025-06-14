import mongoose from "mongoose";
 let isConnected = false;
export const connectDB = async () => {
  if (isConnected) return;
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected successfully ${conn.connection.host} `);
     isConnected = true;
  } catch (error) {
    console.log("MongoDB connection failed", error);
    process.exit(1);
  }
};
