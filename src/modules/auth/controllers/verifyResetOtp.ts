import { Request, Response } from "express";
import { HttpStatus } from "../../common/enums/StatusCodes";


const verifyResetOtp = 
  async (req: Request, res: Response): Promise<Response> => {
    const { otp } = req.body;

    const sessionOtp = req.session.passwordReset?.otp;
    const expiredAt = req.session.passwordReset?.expires_at;
    const currentTime = Date.now();

    if (!sessionOtp || currentTime > expiredAt) {
      return res.status(HttpStatus.BadRequest).json({
        status: "Bad Request",
        message: "OTP is invalid or has expired",
      });
    }

    if (sessionOtp !== otp) {
      return res.status(HttpStatus.BadRequest).json({
        status: "Bad Request",
        message: "OTP is incorrect",
      });
    }

    req.session.passwordReset.isVerified = true;

    return res.status(HttpStatus.Success).json({
      status: "Success",
      message: "OTP has been verified. You can now reset your password.",
    });
  }
;

export default verifyResetOtp