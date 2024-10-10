import mongoose, { Schema } from "mongoose";
import { IGoogleUser } from "modules/interfaces/IGoogleUser";

const googleSchema = new Schema<IGoogleUser>({
  googleId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  phoneNumber: {
    type: Number,
    required: false,
  },
  profilePicture: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: false,
  },
  refreshToken: {
    type: String,
    required: true,
  },
});

export default mongoose.model<IGoogleUser>("GoogleUser", googleSchema);
