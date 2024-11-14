import { Schema, model, Document } from 'mongoose';

interface Order extends Document {
  userId: string;
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
  userId: { type: String, required: true },
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

export const Order = model<Order>('Order', orderSchema);
