import { User } from "../models/User";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response } from "express";
import { HttpStatus } from "../../common/enums/StatusCodes";
import { generateAccessToken } from "../../common/utils/genAccessToken";

export const refreshToken = async (req: Request, res: Response): Promise<Response | void> => {
  const cookies = req.cookies;

  if (!cookies?.refreshToken) {
    return res.status(HttpStatus.Unauthorized).json({ message: 'Unauthorized: No refresh token provided' });
  }

  const refreshToken = cookies.refreshToken;

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string, async (err: Error | null, decoded: JwtPayload | string | undefined) => {
    if (err) {
      if (err instanceof jwt.TokenExpiredError) {
        return res.status(HttpStatus.Unauthorized).json({ message: 'Token expired' });
      }
      return res.status(HttpStatus.Forbiddden).json({ message: 'Forbidden: Invalid token' });
    }

    // Check if decoded is a JwtPayload (an object), not a string
    if (typeof decoded !== 'object' || !decoded || !(decoded as JwtPayload).id) {
      return res.status(HttpStatus.Unauthorized).json({ message: 'Unauthorized: Invalid token data' });
    }

    const userId = (decoded as JwtPayload).id;

    const foundUser = await User.findOne({ _id: userId }).exec();

    if (!foundUser) {
      return res.status(HttpStatus.Unauthorized).json({ message: 'Unauthorized: User not found' });
    }

    if (foundUser.refreshToken !== refreshToken) {
      return res.status(HttpStatus.Forbiddden).json({ message: 'Forbidden: Refresh token mismatch' });
    }

    const accessToken = generateAccessToken(foundUser._id, foundUser.roles);

    return res.json({ accessToken });
  });
};
