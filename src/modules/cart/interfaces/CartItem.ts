
import { Document, Types } from "mongoose";

export interface ICartItem extends Document {
  productId: Types.ObjectId; 
  quantity: number; 
  size: "xs" | "sm" | "md" | "lg" | "xl" | "xxl"; 
  price: number; 
  image: string;
}
