import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { User } from "../models/User";
import { validateRegisterInput } from "../models/User";
import { HttpStatus } from "../../common/enums/StatusCodes";
import { generateOtp } from "../utils/generateOtp";
import sendOTPEmail from "../../common/utils/sendEmail";
import "../../interfaces/session"

const OTP_EXPIRY_TIME = 5 * 60 * 1000;

const registerUser = asyncHandler(
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
    const otpExpiry = Date.now() + OTP_EXPIRY_TIME;
    const OTP = await generateOtp();
    // store credentials in body to the session

    req.session.user = {
      firstname,
      lastname,
      state,
      email,
      password,
    };
    req.session.otp = {
      value: OTP,
      expires_at: otpExpiry,
    };
    const result = await sendOTPEmail(email as string, OTP, "Your one-time Email verification code is:");
    // console.log("Session before saving:", req.session);
    // req.session.save(err => {
    //   if (err) {
    //     console.error("Error saving session:", err);
    //   } else {
    //     console.log("Session saved successfully.");
    //   }
    // });
    
    res.status(HttpStatus.Created).json({
      status: "success",
      message: result,
      otp: OTP
    });
  }
);

export default registerUser;

