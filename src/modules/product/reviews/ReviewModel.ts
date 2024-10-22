import mongoose, { Schema, Document, Types } from "mongoose";
import Joi from "joi";



export interface IReview extends Document {
  userId: Types.ObjectId;
  name: string;
  rating: number;
  comment: string;
}

const ReviewSchema: Schema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
});







export const validateReview = (review: Record<string, any>) => {
    const schema = Joi.object({
        userId: Joi.string().required(),
        name: Joi.string().optional(),
        rating: Joi.number().min(1).max(5).optional(),
        comment: Joi.string().required(),
      });
  return  schema.validate(review);
};


export default mongoose.model<IReview>("Review", ReviewSchema);
