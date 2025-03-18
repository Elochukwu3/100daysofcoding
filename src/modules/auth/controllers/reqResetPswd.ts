import { Request, Response } from "express";
import { User } from "../models/User";
import { HttpStatus } from "../../common/enums/StatusCodes";
import { generateOtp } from "../../auth/utils/generateOtp";
import sendOTPEmail from "../../common/utils/sendEmail";
import NodeCache from "node-cache";

// import redisClient from "../../common/config/redisClient";

import { OTP_STATIC_VALUE } from "../../auth/static/otp.static";

const cache = new NodeCache({ stdTTL: 300 });

const requestPasswordReset = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { OTP_EXPIRY_TIME } = OTP_STATIC_VALUE;
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(HttpStatus.NotFound).json({
      status: "Not Found",
      message: "User with this email does not exist",
    });
  }

  const resetOtp = await generateOtp();

  const tokenData = {
    otp: resetOtp,
    expiresAt: Date.now() + OTP_EXPIRY_TIME,
    isVerified: false,
  };

  cache.set(email, OTP_EXPIRY_TIME / 1000, JSON.stringify(tokenData));

  const message = `You requested a password reset. Your 6-digit token is:`;
  try {
    const result = await sendOTPEmail(email, resetOtp, message);
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
};

export default requestPasswordReset;
