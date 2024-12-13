import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { User } from "../models/User";
import { validateRegisterInput } from "../models/User";
import { hashPassword } from "../../common/utils/hashPassword";
import { HttpStatus } from "../../common/enums/StatusCodes";
import { generateOtp } from "../utils/generateOtp";
import sendOTPEmail from "../../common/utils/sendEmail";
import "../../interfaces/session";
import { OTP_STATIC_VALUE } from "../../auth/static/otp.static";
import redisClient from "../../common/config/redisClient";

const registerUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { firstname, lastname, state, email, password } = req.body;
    const { error } = validateRegisterInput(req.body);
    const { OTP_EXPIRY_TIME } = OTP_STATIC_VALUE;

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
    const otpExpiry = Date.now() + OTP_EXPIRY_TIME;
    const OTP = await generateOtp();
    const hashedPassword = await hashPassword(password);

    await redisClient.setEx(
      email,
      OTP_EXPIRY_TIME,
      JSON.stringify({
        firstname,
        lastname,
        state,
        email,
        password: hashedPassword,
        otp: OTP,
        expiresAt: otpExpiry,
      })
    );

    const result = await sendOTPEmail(
      email as string,
      OTP,
      "Your one-time Email verification code is:"
    );
    res.status(HttpStatus.Created).json({
      status: "success",
      message: result,
      otp: OTP,
      email
    });
  }
);

export default registerUser;
