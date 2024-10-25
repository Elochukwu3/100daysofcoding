import { Request, Response } from "express";
import { HttpStatus } from "../../common/enums/StatusCodes";
import { User, validateOtpInput } from "../models/User";
import redisClient from "../../common/config/redisClient";
import { generateAccessToken } from "../../common/utils/genAccessToken";
import { generateRefreshToken } from "../../common/utils/genRefreshToken";
import { setTokens } from "../../auth/utils/tokenGenerator";

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
        password: user.password,
        address:""
      });

      await redisClient.del(email);
      // const roles = Object.values(newUser.roles) as number[];
      const accessToken = generateAccessToken(newUser._id, newUser.roles);
      const refreshToken = generateRefreshToken(newUser._id);
      newUser.refreshToken = refreshToken;
      
      await newUser.save();
      await setTokens(res, accessToken, refreshToken, newUser._id);

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
