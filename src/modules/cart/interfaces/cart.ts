// src/interfaces/Cart.ts
import { Document, Types } from "mongoose";
import { ICartItem } from "./CartItem";

export interface ICart extends Document {
  userId: Types.ObjectId;
  items: ICartItem[];
  totalAmount: number;
}
