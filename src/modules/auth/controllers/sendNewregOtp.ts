import { Response, Request } from "express";
import { HttpStatus } from "../../common/enums/StatusCodes";
import { generateOtp } from "../utils/generateOtp2";
import sendOTPEmail from "../../common/utils/sendEmail";


const OTP_EXPIRY_TIME = 5 * 60 * 1000;

const newRegistrationOtp = async (
  req: Request,
  res: Response
): Promise<Response | undefined> => {
    try {
        
        if (!req.session.otp) {
            return res.status(HttpStatus.BadRequest).json({
              status: "Bad request",
              message: "OTP has not been generated or assigned. Please request a new OTP.",
              statusCode: HttpStatus.BadRequest,
            });
          }
          if (!req.session) {
            res.locals.error = "Session not found for request";
            return res
              .status(HttpStatus.ServerError)
              .json({ message: "No session found" });
          }
          const otpExpiry = Date.now() + OTP_EXPIRY_TIME;
          const OTP = await generateOtp();
          const { email} = req.session.user
          req.session.otp = {
            value: OTP,
            expires_at: otpExpiry,
          };
          const result = await sendOTPEmail(email as string, OTP, "Your one-time Email verification code is:");


          res.status(HttpStatus.Created).json({
            status: "success",
            message: result,
            otp: OTP
          });
    } catch (error) {
        return res.status(HttpStatus.ServerError).json({
            status: "Bad request",
            message: "Internal server error",
            error: `${error} error`,
            statusCode: HttpStatus.ServerError,
          });
    }
};


export default newRegistrationOtp;