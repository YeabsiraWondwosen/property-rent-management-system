import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ Database Connection Failed");
    console.error(error.message);
    console.error("⚠️ Continuing without MongoDB connection.");
  }
};

export default connectDB;