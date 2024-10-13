import { Request, Response } from "express";
import { User, validatePasswordInput } from "../models/User"; 
import { HttpStatus } from "../../common/enums/StatusCodes";
import { validatePassword } from "../../common/utils/validatePassword";
import { hashPassword } from "../../common/utils/hashPassword";

const changePassword = async (req: Request<{}, {}, {oldPassword: string, newPassword: string}>, res: Response): Promise<void> => {
  const { oldPassword, newPassword } = req.body;

  if (!newPassword) {
    res.status(HttpStatus.BadRequest).json({
      status: "failed",
      message: "New password is required",
      statusCode: HttpStatus.BadRequest
    });
    return;
  }

  const userId = req.user?.id;
  if (!userId) {
    res.status(HttpStatus.Unauthorized).json({
      status: "failed",
      message: "Unauthorized",
      statusCode: HttpStatus.Unauthorized
    });
    return;
  }

  const user = await User.findById(userId).exec();
  if (!user) {
    res.status(HttpStatus.NotFound).json({
      status: "failed",
      message: "User not found",
      statusCode: HttpStatus.NotFound
    });
    return;
  }

 
  if (!user.password || (user.provider?.includes('google') ?? false)) {
    res.status(HttpStatus.BadRequest).json({
      status: "failed",
      message: "Cannot change password for Google OAuth users",
    });
    return;
  }

  
  const isMatch = await validatePassword(oldPassword, user.password);
  if (!isMatch) {
    res.status(HttpStatus.BadRequest).json({
      status: "failed",
      message: "Old password is incorrect",
    });
    return;
  }

  const { error } = validatePasswordInput({ password: newPassword });
  if (error) {
    res.status(HttpStatus.BadRequest).json({
      status: "failed",
      message: error.details[0].message,
    });
    return;
  }

  const isNewPasswordSame = await validatePassword(newPassword, user.password);
  if (isNewPasswordSame) {
    res.status(HttpStatus.BadRequest).json({
      status: "failed",
      message: "New password cannot be the same as the old password",
    });
    return;
  }

  // Hash the new password and save it
  const hashedNewPassword = await hashPassword(newPassword);
  user.password = hashedNewPassword;
  await user.save();

  res.status(HttpStatus.Success).json({
    status: "success",
    message: "Password updated successfully",
  });
  return;
};

export default changePassword;
