// src/modules/auth/controllers/auth.controller.ts

import { Request, Response } from "express";
import { Token, validateEmail } from "../models/token";
import sendOTPEmail from "../../common/utils/sendEmail";
import { generateOtp } from "../utils/generateOtp";

export const getOtp = async (
  req: Request,
  res: Response
): Promise<Response | undefined> => {
  try {
    const { email } = req.query;
    const { error } = validateEmail({ email: email as string });
    if (error) {
      return res.status(400).json({
        status: "Bad request",
        message: error?.message.replace(/\"/g, ""),
        statusCode: "400",
      });
    }
    const OTP = await generateOtp();

    await Token.create({
      email: email,
      token: OTP,
      purpose: "email_verification",
    });

    await sendOTPEmail(email as string, OTP);

    return res.status(200).json({
      status: "success",
      message: "OTP sent successfully",
      data: {
        otp: OTP,
      },
      statusCode: "200",
    });
  } catch (error) {
    return res
      .status(500)
      .json({
        status: "Bad request",
        message: "Internal server error",
        error,
        statusCode: "500",
      });
  }
};

export default getOtp;
