import { Request, Response } from "express";
import { User, validatePasswordInput } from "../models/User"; 
import { HttpStatus } from "../../common/enums/StatusCodes";
import { validatePassword } from "../../common/utils/validatePassword";
import { hashPassword } from "../../common/utils/hashPassword";

const changePassword = async (req: Request<{}, {}, {oldPassword: string, newPassword: string}>, res: Response): Promise<Response | void> => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!newPassword || !oldPassword) {
      return res.status(HttpStatus.BadRequest).json({
        status: "failed",
        message: "newPassword | oldPassword is required",
        statusCode: HttpStatus.BadRequest,
      });
    }

    const userId = req.user?.id;
    if (!userId) {
      return res.status(HttpStatus.Unauthorized).json({
        status: "failed",
        message: "Unauthorized",
        statusCode: HttpStatus.Unauthorized,
      });
    }

    const user = await User.findById(userId).exec();
    if (!user) {
      return res.status(HttpStatus.NotFound).json({
        status: "failed",
        message: "User not found",
        statusCode: HttpStatus.NotFound,
      });
    }

    if (!user.password || (user.provider?.includes('google') ?? false)) {
      return res.status(HttpStatus.BadRequest).json({
        status: "failed",
        message: "Cannot change password for Google OAuth users",
      });
    }

    // Validate old password
    const isMatch = await validatePassword(oldPassword, user.password);
    if (!isMatch) {
      return res.status(HttpStatus.BadRequest).json({
        status: "failed",
        message: "Old password is incorrect",
      });
    }

    // Validate the new password format
    const { error } = validatePasswordInput({ password: newPassword });
    if (error) {
      return res.status(HttpStatus.BadRequest).json({
        status: "failed",
        message: error.details[0].message,
      });
    }

    // Ensure new password is not the same as the old one
    const isNewPasswordSame = await validatePassword(newPassword, user.password);
    if (isNewPasswordSame) {
      return res.status(HttpStatus.BadRequest).json({
        status: "failed",
        message: "New password cannot be the same as the old password",
      });
    }

    // Hash the new password and save it
    const hashedNewPassword = await hashPassword(newPassword);
    user.password = hashedNewPassword;
    await user.save();

    return res.status(HttpStatus.Success).json({
      status: "success",
      message: "Password updated successfully",
    });
  } catch (error) {
    // Log the error for debugging
    console.error(error);
    return res.status(HttpStatus.ServerError).json({
      status: "failed",
      message: "An error occurred while updating the password",
    });
  }
};

export default changePassword;
