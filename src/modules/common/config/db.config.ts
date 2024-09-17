import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connect(process.env.DB_URL as string);

    mongoose.connection.on("open", () => {
      console.log("Mongoose connected to DB");

    });
    
    mongoose.connection.on("error", (err) => {
      console.error(`Mongoose connection error: ${err}`);
      // logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log');
    });
    
    mongoose.connection.on("disconnected", () => {
      console.log("Mongoose disconnected");
    });
  } catch (err) {
    console.error("MongoDB connection error:", err);
    // logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log');
    process.exit(1);
  }
};

export default connectDB;
