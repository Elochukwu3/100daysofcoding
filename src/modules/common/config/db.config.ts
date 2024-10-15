import mongoose from "mongoose";
import { logger } from '../../common/service/logger';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL as string, {
      serverSelectionTimeoutMS: 30000
    });

    
  } catch (err) {
    if (err instanceof Error) {
      logger.error(`Mongoose connection error: ${err.message}`);
      process.exit(1);
    } else {
      process.exit(1);
    }
  }
};
connectDB()

mongoose.connection.on("open", () => {
  console.log("DB Connected....");
});
mongoose.connection.on("connected", ()=> {
  logger.info("Connected to MongoDB successfully");
  });

mongoose.connection.on("error", (err) => {
  logger.error(`Mongoose connection error: ${err.message}`);
  throw new Error(`Database connection error: ${err.message}`);
});

mongoose.connection.on("disconnected", () => {
  logger.info("Mongoose disconnected");
});

export default connectDB;
