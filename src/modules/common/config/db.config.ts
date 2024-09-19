import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL as string, {
      serverSelectionTimeoutMS: 30000
    });

    
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Database connection error: ${err.message}`);
      process.exit(1); // Exit the process on connection failure
    } else {
      process.exit(1);
    }
  }
};
connectDB()

mongoose.connection.on("open", () => {
  console.log("Mongoose connected to DB");
});
mongoose.connection.on("connected", ()=> {console.log("Mongoose connected successfully");});

mongoose.connection.on("error", (err) => {
  console.error(`Mongoose connection error: ${err.message}`);
  // logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log');
  throw new Error(`Database connection error: ${err.message}`);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected");
});

export default connectDB;
