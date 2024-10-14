import { Request, Response } from "express";
import { HttpStatus } from "../../common/enums/StatusCodes";
import redisClient from "../../common/config/redisClient"; // Redis client instance

const verifyResetOtp = async (req: Request, res: Response): Promise<Response> => {
  const { otp, email } = req.body; // Assuming email is provided in the request body

  // Retrieve the OTP and related data from Redis using email as the key
  const userOtpData = await redisClient.get(email);

  if (!userOtpData) {
    return res.status(HttpStatus.BadRequest).json({
      status: "Bad Request",
      message: "OTP has not been generated or has expired. Please request a new OTP.",
    });
  }

  const { otp: storedOtp, expiresAt, isVerified } = JSON.parse(userOtpData);
  const currentTime = Date.now();

  // Check if the OTP is expired
  if (currentTime > expiresAt) {
    await redisClient.del(email); // Remove expired OTP from Redis
    return res.status(HttpStatus.BadRequest).json({
      status: "Bad Request",
      message: "OTP has expired. Please request a new one.",
    });
  }

  // Check if the OTP matches
  if (storedOtp !== otp) {
    return res.status(HttpStatus.BadRequest).json({
      status: "Bad Request",
      message: "OTP is incorrect. Please try again.",
    });
  }

  // Mark OTP as verified
  const updatedOtpData = {
    otp: storedOtp,
    expiresAt,
    isVerified: true, // Mark as verified
  };

  await redisClient.set(email, JSON.stringify(updatedOtpData));

  return res.status(HttpStatus.Success).json({
    status: "Success",
    message: "OTP has been verified. You can now reset your password.",
  });
};

export default verifyResetOtp;
