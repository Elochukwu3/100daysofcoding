// src/interfaces/User.ts
import { Document } from "mongoose";

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface IUser extends Document {
  _id: string;
  firstname: string;
  lastname: string;
  state: string;
  email: string;
  password: string;
  retypePassword?: string; // This field is for validation only, not stored in DB
  isVerified: boolean;
}
