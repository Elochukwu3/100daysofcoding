import expressAsyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { validateLoginInput } from "../models/User";
import { HttpStatus } from "../../common/enums/StatusCodes";
import { User } from "../models/User";
import { validatePassword } from "../../common/utils/validatePassword";
import { generateAccessToken } from "../../common/utils/genAccessToken";
import { generateRefreshToken } from "../../common/utils/genRefreshToken";
import { setTokens } from "@auth/utils/tokenGenerator";

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
    const user = await User.findOne({ email }).exec();
    if (!user) {
      res.status(HttpStatus.BadRequest).json({
        status: "Bad Request",
        message: "User is not found",
        statuscode: HttpStatus.BadRequest,
      });
      return;
    }
    const checkPassword = await validatePassword(
      password,
      user.password as string
    );
    if (!checkPassword) {
      res.status(HttpStatus.BadRequest).json({
        status: "Bad Request",
        message: "Password Incorrect",
        statusCode: HttpStatus.BadRequest,
      });
      return;
    }
    try {
      // const roles = Object.values(user.roles) as number[];

      const accessToken = generateAccessToken(user._id, user.roles);
      const refreshToken = generateRefreshToken(user._id);
      user.refreshToken = refreshToken;

      await user.save();
      await setTokens(res, accessToken, refreshToken, user._id);
    } catch (error: any) {
      console.error(error.message);
    }
  }
);

export default loginUser;
