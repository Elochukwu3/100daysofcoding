import { Request, Response } from "express";
import { User, validatePasswordInput } from "../models/User";
import { hashPassword } from "../../common/utils/hashPassword";
import { HttpStatus } from "../../common/enums/StatusCodes";

 const resetPassword = 
  async (req: Request, res: Response): Promise<Response> => {
    const { newPassword } = req.body;


    if (!req.session.passwordReset?.isVerified) {
        return res.status(HttpStatus.Unauthorized).json({
          status: "Unauthorized",
          message: "You must verify the OTP before resetting your password",
        });
      }

    const email = req.session.passwordReset?.email;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(HttpStatus.NotFound).json({
        status: "Not Found",
        message: "User not found",
      });
    }
    //checking for password strength
    const {error} = validatePasswordInput(newPassword)
    if(error){
     return res.status(HttpStatus.BadRequest).json({
        status: "Bad request",
        message: error.details[0].message,
        statusCode: "400",
      });
    }

    //hashing/saving to db
    user.password = await hashPassword(newPassword);
    await user.save();

    //destroy session
    req.session.destroy((err) => {
      if (err) {
        return res.status(HttpStatus.ServerError).json({
          status: "Error",
          message: "Failed to destroy session",
        });
      }
    });

    return res.status(HttpStatus.Success).json({
      status: "Success",
      message: "Password has been reset successfully",
    });
  }
;

export default resetPassword;