import { Types, Document } from "mongoose";

interface CartItem extends Document {
  productId: Types.ObjectId; // Ensures productId follows Mongoose ObjectId type
  quantity: number;
  size: "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
  price: number;
  image: string;
}

interface Cart extends Document {
  userId: Types.ObjectId; // Same for userId
  items: CartItem[];
  totalAmount: number;
}

export { Cart, CartItem };
