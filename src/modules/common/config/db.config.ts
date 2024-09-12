import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connect(process.env.DB_URL as string);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    // logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log');
    process.exit(1);
  }
};

export default connectDB;
