import { Request, Response } from "express";
import { User, validatePasswordInput } from "../models/User";
import { hashPassword } from "../../common/utils/hashPassword";
import { HttpStatus } from "../../common/enums/StatusCodes";
import redisClient from "../../common/config/redisClient"; // Importing the Redis client

const resetPassword = async (req: Request, res: Response): Promise<Response> => {
  const { newPassword, email } = req.body;

  if(!email || !newPassword){
    return res.status(HttpStatus.BadRequest).json({
      status: "Bad request",
      message: "Email and new password are required",
    });
  }

  const userOtpData = await redisClient.get(email);
  
  if (!userOtpData) {
    return res.status(HttpStatus.Unauthorized).json({
      status: "Unauthorized",
      message: "You must verify the OTP before resetting your password",
    });
  }

  const { isVerified } = JSON.parse(userOtpData);
  

  if (!isVerified) {
    return res.status(HttpStatus.Unauthorized).json({
      status: "Unauthorized",
      message: "You must verify the OTP before resetting your password",
    });
  }

 
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(HttpStatus.NotFound).json({
      status: "Not Found",
      message: "User not found",
    });
  }

  
  const { error } = validatePasswordInput(newPassword);
  if (error) {
    return res.status(HttpStatus.BadRequest).json({
      status: "Bad request",
      message: error.details[0].message,
    });
  }


  user.password = await hashPassword(newPassword);
  await user.save();

  await redisClient.del(email);

  return res.status(HttpStatus.Success).json({
    status: "Success",
    message: "Password has been reset successfully",
  });
};

export default resetPassword;
