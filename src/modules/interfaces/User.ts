// src/interfaces/User.ts

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface IUser {
  firstname: string;
  lastname: string;
  state: string;
  email: string;
  password: string;
  retypePassword?: string; // This field is for validation only, not stored in DB
}
