// src/interfaces/User.ts
import { Document } from "mongoose";

export interface IUser extends Document {
  _id: string;
  firstname: string;
  lastname: string;
  state: string;
  email: string;
  password: string;
  retypePassword?: string; // This field is for validation only, not stored in DB
  isVerified: boolean;
  address?: string;
  phonenumber?:string; //
}

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id?: string;
    }
  }
}
export interface SessionUser {
  id: string;
  accessToken: string;
}
