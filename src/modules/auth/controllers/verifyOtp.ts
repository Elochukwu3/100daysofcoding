import { Request, Response } from "express";
import { hashPassword } from "../../common/utils/hashPassword";
import { HttpStatus } from "../../common/enums/StatusCodes";
import { User, validateOtpInput } from "../models/User";


const verifyOtp = async (
  req: Request,
  res: Response
): Promise<Response | undefined> => {
  try {
    const { otp } = req.body;
    const {error} = validateOtpInput(otp);
    if (error) {
      return res.status(HttpStatus.BadRequest).json({
        status: "Bad request",
        message: error.details[0].message,
        statusCode: "400",
      });
    }
    const sessionOtp = req.session.otp.value;
    const expiredAt = req.session.otp.expires_at;
    const currentTime = Date.now();
    
 
    if (currentTime > expiredAt) {
      
      return res.status(HttpStatus.BadRequest).json({
        status: "Bad request",
        message: "OTP has expired",
        statusCode: "400",
      });
    }

    if(sessionOtp !== otp){
      return res.status(HttpStatus.BadRequest).json({
        status: "Bad request",
        message: "OTP does not match",
        statusCode: "400",
      });
    } 
    if (sessionOtp && sessionOtp === otp) {
      const user = req.session.user;
      if (!user) return res.sendStatus(HttpStatus.ServerError);
      const hashedPassword = await hashPassword(user.password);

      const newUser = await User.create({
        firstname: user.firstname,
        lastname: user.lastname,
        state: user.state,
        email: user.email,
        password: hashedPassword,
      });

      req.session.destroy((err) => {
        if (err)
          res
            .status(HttpStatus.ServerError)
            .json({ message: "Session could not be destroyed" });
      });
      return res.status(HttpStatus.Success).json({
        status: "Success",
        message: "User has been be registered and verified",
        data: {
          user: {
            id: newUser._id,
            email: newUser.email,
          },
        },
      });
    }
   
   
  } catch (error) {
    return res.status(HttpStatus.ServerError).json({
      status: "Bad request",
      message: "Internal server error",
      error,
      statusCode: "500",
    });
  }
};
export default verifyOtp;
