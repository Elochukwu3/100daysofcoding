// src/interfaces/User.ts
import { Document } from "mongoose";

export interface IUser extends Document {
  _id: string;
  firstname: string;
  gender?:string;
  lastname: string;
  state?: string;
  email: string;
  password?: string;
  profilePicture: string | null;
  retypePassword?: string; // This field is for validation only, not stored in DB
  isVerified: boolean;
  address?: string;
  phonenumber?: string;
  provider: [string];
  googleId?: string;
  phoneNumber?: string;
  roles: {
    User: number;
    Admin?: number;
  };
  refreshToken: String;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id?: string;
      googleId?: string;
      firstname?: string;
      lastname?: string;
      email?: string;
      phoneNumber?: string;
      profilePicture?: string;
      accessToken?: string;
      roles?: number[];
    };
  }
}
export interface SessionUser {
  id: string;
  accessToken: string;
}
