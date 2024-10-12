import { Request } from 'express';
import mongoose from "mongoose";
import Joi from "joi";


const tokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  email: {
    type: String,
    required: true,
    ref: "user",
    unique: true,
  },
  created_at: { type: Date, default: Date.now },
  expires_at: {
    type: Date,
    required: true,
    default:  function () {
      return new Date(Date.now() + 4 * 60 * 1000);
    },
  },
  purpose: {
    type: String,
    required: true,
    enum: ["reset_password", "email_verification"],
  },
});
 
// Validate email before creating a new token
 const validateEmail = (email: { email: string})=>{
    const schema = Joi.object({
        email: Joi.string().email().required(),
    })
    return schema.validate(email)
 }
 

const Token = mongoose.model('Token', tokenSchema);

export {Token, validateEmail}
