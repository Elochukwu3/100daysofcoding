import { Request, Response } from "express";
import { User } from "../models/User";
import { HttpStatus } from "../../common/enums/StatusCodes";
import { generateOtp } from "../../auth/utils/generateOtp";
import sendOTPEmail from "../../common/utils/sendEmail";

const TOKEN_EXPIRY_TIME = 2 * 60 * 1000; //2 mins


const requestPasswordReset = 
  async (req: Request, res: Response): Promise<Response> => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(HttpStatus.NotFound).json({
        status: "Not Found",
        message: "User with this email does not exist",
      });
    }

    // Generate 6-digit token
    const resetOtp = await generateOtp()

    // Set token and expiry in session
    req.session.passwordReset = {
      email,
      otp: resetOtp,
      expires_at: Date.now() + TOKEN_EXPIRY_TIME,
      isVerified: false,
    };

    const message = `You requested a password reset. Your 6-digit token is:`;
    const result = await sendOTPEmail(email, resetOtp, message)
    try {
      return res.status(HttpStatus.Success).json({
        status: "Success",
        message: result,
      });
    } catch (error) {
      return res.status(HttpStatus.ServerError).json({
        status: "Error",
        message: "Failed to send email. Try again later.",
      });
    }
  }
;

export default requestPasswordReset;