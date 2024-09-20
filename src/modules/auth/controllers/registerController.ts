import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { User } from "../models/User";
import { validateRegisterInput } from "../models/User";
import { HttpStatus } from "../../common/enums/StatusCodes";
import { generateOtp } from "../utils/generateOtp";
import sendOTPEmail from "../../common/utils/sendEmail";

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
    // store credentials in body to the session
    (req.session as any).user = {
      firstname,
      lastname,
      state,
      email,
      password,
    };
    const OTP = await generateOtp();
    (req.session as any).otp = OTP;

    const result = await sendOTPEmail(email as string, OTP);

    res.status(HttpStatus.Created).json({
      status: "success",
      message: result,
    });
  }
);

export default registerUser;
