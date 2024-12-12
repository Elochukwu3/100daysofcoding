import mongoose from "mongoose";
import Joi from "joi";
import { ICart } from "../interfaces/cart";

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
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      size: {
        type: String,
        enum: ["xs", "sm", "md", "lg", "xl", "xxl"],
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
    },
  ],
  totalAmount: {
    type: Number || String,
    required: true,
  },
});



// Joi validation schema for a cart
const cartValidateShema = Joi.object({

        productId: Joi.string().required(), // Mongoose ObjectId as a string
        quantity: Joi.number().min(1).required(),
        size: Joi.string()
          .valid("xs", "sm", "md", "lg", "xl", "xxl")
          .required(),
        price: Joi.number().positive().required(),
        image: Joi.string().uri().required(),
});

const Cart = mongoose.model<ICart>("Cart", cartSchema);
export const validateCart = (data: Record<string, any>) => {
  return cartValidateShema.validate(data);
};

export default Cart;
