import { Request, Response } from "express";
import { User, validatePasswordInput } from "../models/User"; 
import { HttpStatus } from "../../common/enums/StatusCodes";
import { validatePassword } from "../../common/utils/validatePassword";
import { hashPassword } from "../../common/utils/hashPassword";

const changePassword = 
  async (req: Request, res: Response): Promise<void> => {
    const { oldPassword, newPassword } = req.body;
    
    if (!oldPassword || !newPassword) {
      res.status(HttpStatus.BadRequest).json({ status: "failed", message: "Old password and new password are required" });
      return;
    }

    const userId = req.user?.id
    if (!userId) {
      res.status(HttpStatus.Unauthorized).json({status:"Bad request", message: "Unauthorized" });
      return;
    }

   
    const user = await User.findById(userId).exec();
    if (!user) {
      res.status(HttpStatus.NotFound).json({ status:"Bad request", message: "User not found" });
      return;
    }

    //chack old password validity
    console.log(user);
    
    const isMatch = await validatePassword(oldPassword, user.password);
    if (!isMatch) {
      res.status(HttpStatus.BadRequest).json({status:"Bad request", message: "Old password is incorrect" });
      return;
    }
    const {error} = validatePasswordInput({"password":newPassword})
    if(error){
      res.status(HttpStatus.BadRequest).json({
        status: "Bad request",
        message: error.details[0].message,
        statusCode: "400",
      });
      return;
    }
    
    //use new password to check old password validity
    const ifNewisOld = await validatePassword(newPassword, user.password);
    if(ifNewisOld) {
      res.status(HttpStatus.BadRequest).json({status:"Bad request", message: "New password cannot be the same as the old password" });
      return;
    }

   const hashedNewPassword = await hashPassword(newPassword);

    user.password = hashedNewPassword;
    await user.save();

    res.status(HttpStatus.Success).json({status: "success", message: "Password updated successfully" });
  }

  export  default changePassword;