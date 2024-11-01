import mongoose, { Types, Document } from "mongoose";
import joi from "joi";

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      size: {
        type: String,
        enum: ["xs", "sm", "md", "lg", "xl", "xxl"],
      },
      price: {
        type: Number,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
      isAvailable: { type: Boolean, default: true },
      discount: { type: Number, default: 0 },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
});

const validateAddProduct = joi.object({
  productId: joi.string().length(24).hex().required(),
  quantity: joi.number().integer().positive().required(),
  size: joi.string().valid("xs", "sm", "md", "lg", "xl", "xxl").optional(),
  price: joi.number().positive().required(),
  image: joi.string().uri().optional(),
  discount: joi.number().positive().optional(),
});

const validateUpdateProduct = joi.object({
  productId: joi.string().length(24).hex().required(),
  quantity: joi.number().integer().positive().optional(),
  size: joi.string().valid("xs", "sm", "md", "lg", "xl", "xxl").optional(),
});

export const validatePutProduct = (product: Record<string, any>) => {
  return validateUpdateProduct.validate(product);
};

export const validatePostProduct = (product: Record<string, any>) => {
  return validateAddProduct.validate(product);
};
export interface CartItem extends Document {
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

export default mongoose.model<Cart>("Cart", cartSchema);
