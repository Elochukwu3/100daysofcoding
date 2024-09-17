import expressAsyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { validateLoginInput } from "../models/User";
import { HttpStatus } from "../../common/enums/StatusCodes";
import { User } from "../models/User";
import { validatePassword } from "../../common/utils/validatePassword";
import { generateAccessToken } from "../../common/utils/genAccessToken";
import { generateRefreshToken } from "../../common/utils/genRefreshToken";

const loginUser = expressAsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    const { error } = validateLoginInput(req.body);
    if (error) {
      res.status(HttpStatus.BadRequest).json({
        status: "Bad Request",
        message: error.details[0].message,
        statusCode: HttpStatus.BadRequest,
      });
      return;
    }
    const user = await User.findOne({ email }).lean().exec();
    if (!user) {
      res.status(HttpStatus.BadRequest).json({
        status: "Bad Request",
        message: "User is not found",
        statuscode: HttpStatus.BadRequest,
      });
      return;
    }
    const checkPassword = await validatePassword(password, user.password);
    if (!checkPassword) {
      res.status(HttpStatus.BadRequest).json({
        status: "Bad Request",
        message: "Password Incorrect",
        statusCode: HttpStatus.BadRequest,
      });
      return;
    }
    try {
      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV == "development",
        maxAge: 24 * 60 * 60 * 1000,
      });
      await User.findByIdAndUpdate(
        user._id,
        { refreshToken },
        { new: true, upsert: false }
      );

      res.status(HttpStatus.Success).json({
        status: "Success",
        message: "Login successful",
        data: {
          accessToken,
          user: {
            userId: user._id,
            email,
          },
        },
      });
    } catch (error: any) {
      console.error(error.message);
    }
  }
);

export default loginUser;
