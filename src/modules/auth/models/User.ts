import mongoose, { Schema } from "mongoose";
import { IUser } from "../../interfaces/User";
import Joi from "joi";

const userSchema = new Schema<IUser>({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  state: { type: String, required: true },
  profilePicture: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  isVerified: { type: Boolean, required: true, default: true },
  address: { type: String, required: false },
  provider: {
    type: [String],
    required: true,
    default: ["local"],
  },
  roles: {
    Admin: { type: Number },
    User: { type: Number, default: 1000, required: true },
  },
  refreshToken: { type: String },
});

// The Joi of validating client input

export const validateRegisterInput = (data: any) => {
  const schema = Joi.object({
    firstname: Joi.string().min(2).trim().required(),
    lastname: Joi.string().min(2).trim().required(),
    state: Joi.string().min(3).required(),
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    password: Joi.string()
      .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]{8,}$"))
      .required()
      .messages({
        "string.pattern.base":
          "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 digit, and be at least 8 characters long",
      }),
    confirmPassword: Joi.string()
      .valid(Joi.ref("password"))
      .required()
      .messages({ "any.only": "Passwords do not match" }),
  });

  return schema.validate(data);
};
export const validatePasswordInput = (data: any) => {
  const schema = Joi.object({
    password: Joi.string()
      .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]{8,}$"))
      .required()
      .messages({
        "string.pattern.base":
          "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 digit, and be at least 8 characters long",
      }),
    // confirmPassword: Joi.string()
    //   .valid(Joi.ref("password"))
    //   .required()
    //   .messages({ "any.only": "Passwords do not match" }),
  });

  return schema.validate(data);
};
export const validateLoginInput = (data: any) => {
  const schema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2 }),
    password: Joi.string()
      .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]{8,}$"))
      .required()
      .messages({
        "string.pattern.base":
          "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 digit, and be at least 8 characters long",
      }),
  });
  return schema.validate(data);
};

export const validateOtpInput = (data: string) => {
  const schema = Joi.string().length(6).required().messages({
    "string.length": "OTP must be 6 characters long",
    "any.required": "OTP is required",
  });

  return schema.validate(data);
};
export const User = mongoose.model<IUser>("User", userSchema);

// const userSchema = new Schema<IUser>({
//   firstname: { type: String, required: false },  // Optional for Google users
//   lastname: { type: String, required: false },   // Optional for Google users
//   state: { type: String, required: false },      // Optional for Google users
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: false },   // Optional for Google users
//   isVerified: { type: Boolean, required: true, default: false },
//   address: { type: String, required: false },
//   googleId: { type: String, required: false },   // Google-specific field
//   provider: { type: String, enum: ['local', 'google'], default: 'local' },  // To differentiate users
// });

