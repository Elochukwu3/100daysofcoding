import { Request, Response } from "express";
import { HttpStatus } from "../../common/enums/StatusCodes";
import { User, validateOtpInput } from "../models/User";
import redisClient from "../../common/config/redisClient";

const verifyOtp = async (
  req: Request<{}, {}, { otp: string; email: string }>,
  res: Response
): Promise<Response | undefined> => {
  try {
    const { otp, email } = req.body;
    const { error } = validateOtpInput({ otp, email });

    if (error) {
      return res.status(HttpStatus.BadRequest).json({
        status: "Bad request",
        message: error.details[0].message,
        statusCode: HttpStatus.BadRequest,
      });
    }
    const userData = await redisClient.get(email)
    if (!userData) {
      return res.status(HttpStatus.BadRequest).json({
        status: "Bad request",
        message: "OTP has not been generated or assigned. Please request a new OTP.",
        statusCode: HttpStatus.BadRequest,
      });
    }
   
    const user = JSON.parse(userData);
    const currentTime = Date.now();
    
    if (currentTime > user?.expiresAt) {
      user.otp = null; 
        await redisClient.set(email, JSON.stringify(user));
      return res.status(HttpStatus.BadRequest).json({
        status: "Bad request",
        message: "OTP has expired, regenerate new token",
        statusCode: HttpStatus.BadRequest,
      });
    }

    if (user?.otp !== otp) {
      return res.status(HttpStatus.BadRequest).json({
        status: "Bad request",
        message: "OTP does not match",
        statusCode: HttpStatus.BadRequest,
      });
    }



      const newUser = await User.create({
        firstname: user.firstname,
        lastname: user.lastname,
        state: user.state,
        email: user.email,
        password: user.password
      });

      await redisClient.del(email);

      return res.status(HttpStatus.Success).json({
        status: "Success",
        message: "User has been be registered and verified",
        data: {
          user: {
            id: newUser._id,
            email: newUser.email,
          },
        },
        statusCode:HttpStatus.Success
      });

  } catch (error) {
    return res.status(HttpStatus.ServerError).json({
      status: "Bad request",
      message: "Internal server error",
      error: `${error} error`,
      statusCode: "500",
    });
  }
};
export default verifyOtp;
