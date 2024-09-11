import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { User } from "../models/User";
import { validateRegisterInput } from "../models/User";
import { HttpStatus } from "../../common/enums/StatusCodes";
import { hashPassword } from "@common/utils/hashPassword";
import getOtp from "./getOtp";

export const registerUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { firstname, lastname, state, email, password } = req.body;
    const { error } = validateRegisterInput(req.body);
    if (error) {
      res.status(HttpStatus.BadRequest).json({
        status: "Bad request",
        message: error.details[0].message,
        statusCode: HttpStatus.BadRequest,
      });
      return;
    }
    const duplicate = await User.findOne({ email }).lean().exec();

    if (duplicate) {
      res.status(HttpStatus.Conflict).json({
        status: "Conflict",
        message: "User with email already exists",
        statusCode: HttpStatus.Conflict,
      });
      return;
    }

    req.session.user = req.body;

    // VERIFY EMAIL BY SENDING OTP HERE
    // Get Otp and verify it supposed to take place before actually registering

    const hasedPassword = await hashPassword(password);
    const newUser = await User.create({
      firstname,
      lastname,
      state,
      email,
      password: hasedPassword,
    });

    res.status(HttpStatus.Created).json({
      status: "success",
      message: "Registration successful",
      data: {
        user: {
          userId: newUser._id,
          email: newUser.email,
        },
      },
    });
  }
);
