import mongoose, { Schema, Document, Types } from "mongoose";
import Joi from "joi";

interface Product extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  stock: number;
  ratings: number;
  reviews: IReview[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IReview extends Document {
  userId: Types.ObjectId;
  name: string;
  rating: number;
  comment: string;
}

const ReviewSchema: Schema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: { type: String, required: true },
  rating: { type: Number, max: 5, default: 0 },
  comment: { type: String, required: true },
});

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  images: [{ type: String, required: true }],
  stock: { type: Number, required: true },
  ratings: { type: Number, default: 0 },
  reviews: [ReviewSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const validateProduct = (product: any) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(10).max(1000).required(),
    price: Joi.number().positive().precision(2).required(),
    category: Joi.string().required(),
    images: Joi.array().items(Joi.string().uri()).required(),
    stock: Joi.number().integer().min(0).required(),
    ratings: Joi.number().integer().min(0).max(5).optional(),
  });
  return schema.validate(product);
};


const ReviewSchemaPut = Joi.object({
  userId: Joi.string().required(),
  name: Joi.string().optional(),
  rating: Joi.number().min(1).max(5).optional(),
  comment: Joi.string().required(),
});

const ProductSchemaPut = Joi.object({
    name: Joi.string().optional(),
    description: Joi.string().optional(),
    price: Joi.number().positive().optional(),
    category: Joi.string().optional(),
    images: Joi.array().items(Joi.string()).optional(),
    stock: Joi.number().integer().positive().optional(),
    ratings:  Joi.number().min(1).max(5).optional(),
    reviews: Joi.array().items(ReviewSchemaPut).optional(),
    updatedAt: Joi.date().default(Date.now).optional(),
});

// Type assertion for the product object
export const validatePutProduct = (product: Record<string, any>) => {
 return ProductSchemaPut.validate(product);
};

export const validateReview = (review: any) => {
  return  ReviewSchemaPut.validate(review);
};


export default mongoose.model<Product>("Product", ProductSchema);
