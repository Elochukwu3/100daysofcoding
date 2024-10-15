import { Request, Response } from "express";
import { HttpStatus } from "../../common/enums/StatusCodes";
import redisClient from "../../common/config/redisClient"; 
import { validateOtpInput } from "../models/User";

const verifyResetOtp = async (req: Request, res: Response): Promise<Response> => {
  const { otp, email } = req.body;
  const { error } = validateOtpInput({ otp, email });
  if (error) {
    return res.status(HttpStatus.BadRequest).json({
      status: "Bad request",
      message: error.details[0].message,
      statusCode: HttpStatus.BadRequest,
    });
  }

  const userOtpData = await redisClient.get(email);

  if (!userOtpData) {
    return res.status(HttpStatus.BadRequest).json({
      status: "Bad Request",
      message: "OTP has not been generated or has expired. Please request a new OTP.",
    });
  }

  const { otp: storedOtp, expiresAt, isVerified } = JSON.parse(userOtpData);
  const currentTime = Date.now();


  if (currentTime > expiresAt) {
    await redisClient.del(email);
    return res.status(HttpStatus.BadRequest).json({
      status: "Bad Request",
      message: "OTP has expired. Please request a new one.",
    });
  }

  
  if (storedOtp !== otp) {
    return res.status(HttpStatus.BadRequest).json({
      status: "Bad Request",
      message: "OTP is incorrect. Please try again.",
    });
  }

  
  const updatedOtpData = {
    otp: storedOtp,
    expiresAt,
    isVerified: true, 
  };

  await redisClient.set(email, JSON.stringify(updatedOtpData));

  return res.status(HttpStatus.Success).json({
    status: "Success",
    message: "OTP has been verified. You can now reset your password.",
  });
};

export default verifyResetOtp;
