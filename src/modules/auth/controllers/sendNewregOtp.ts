import { Response, Request } from "express";
import { HttpStatus } from "../../common/enums/StatusCodes";
import { generateOtp } from "../utils/generateOtp2";
import sendOTPEmail from "../../common/utils/sendEmail";
import { OTP_STATIC_VALUE } from "../../auth/static/otp.static";
// import redisClient from "../../common/config/redisClient";

import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 0 });

const newRegistrationOtp = async (
  req: Request,
  res: Response
): Promise<Response | undefined> => {
  const { OTP_EXPIRY_TIME } = OTP_STATIC_VALUE;

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(HttpStatus.BadRequest).json({
        status: "Bad request",
        message: "Email is required to generate an OTP.",
        statusCode: HttpStatus.BadRequest,
      });
    }

    // const userData = await redisClient.get(email);
    const userData = cache.get(email);

    if (!userData) {
      return res.status(HttpStatus.BadRequest).json({
        status: "Bad request",
        message:
          "No registration data found for this email. Please start the registration process.",
        statusCode: HttpStatus.BadRequest,
      });
    }

    // const user = JSON.parse(userData);
    const user = userData;

    const otpExpiry = Date.now() + OTP_EXPIRY_TIME;
    const OTP = await generateOtp();

    cache.set(
      email,
      OTP_EXPIRY_TIME / 1000,
      JSON.stringify({
        ...user,
        otp: OTP,
        expiresAt: otpExpiry,
      })
    );

    const result = await sendOTPEmail(
      email as string,
      OTP,
      "Your new one-time Email verification code is:"
    );

    res.status(HttpStatus.Created).json({
      status: "success",
      message: result,
      otp: OTP, //remeber to hide on production
    });
  } catch (error) {
    return res.status(HttpStatus.ServerError).json({
      status: "error",
      message: "Internal server error",
      error: `${error} error`,
      statusCode: HttpStatus.ServerError,
    });
  }
};

export default newRegistrationOtp;
