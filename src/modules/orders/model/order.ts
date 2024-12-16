import { Schema, model, Document, Types } from 'mongoose';
import Joi from 'joi';

interface Order extends Document {
  userId: Types.ObjectId; 
  orderDate: Date;
  status: 'Pending' | 'Delivered' | 'Cancelled';
  total: number;
  paymentMethod: string;
  orderNo: string;
  quantity: number;
  deliveryAddress: string;
  productDetails: {
    name: string;
    image: string;
    price: number;
  };
}

const orderSchema = new Schema<Order>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  orderDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['Pending', 'Delivered', 'Cancelled'], default: 'Pending' },
  total: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  orderNo: { type: String, unique: true, required: true },
  quantity: { type: Number, required: true },
  deliveryAddress: { type: String, required: true },
  productDetails: {
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true }
  }
});



// Joi Schema for Validation
export const orderValidation = Joi.object({
  userId: Joi.string().required().messages({
    'any.required': 'User ID is required.',
    'string.empty': 'User ID cannot be empty.',
  }),
  deliveryAddress: Joi.string().required().messages({
    'any.required': 'Delivery address is required.',
    'string.empty': 'Delivery address cannot be empty.',
  }),
  productDetails: Joi.object({
    name: Joi.string().required(),
    image: Joi.string().uri().required(),
    price: Joi.number().greater(0).required(),
  }).required(),
  quantity: Joi.number().integer().positive().required(),
  paymentMethod: Joi.string().valid('Credit Card', 'PayPal', 'Cash on Delivery').required(),
});


export const Order = model<Order>('Order', orderSchema);
