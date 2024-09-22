import { User } from "../models/User";
import jwt, {JwtPayload} from "jsonwebtoken";
import { Request, Response } from "express";
import { HttpStatus } from "../../common/enums/StatusCodes";
import { generateAccessToken } from "../../common/utils/genAccessToken";

export const refreshToken = async (req: Request, res: Response): Promise<Response | void> => {
  const cookies = req.cookies;

  if (!cookies?.refreshToken) {
    return res.status(HttpStatus.Unauthorized).json({ message: 'Unauthorized' });
  }

  const refreshToken = cookies.refreshToken;

 
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string, async (err: Error | null, decoded: JwtPayload | string | undefined) => {
    if (err) {
      return res.status(HttpStatus.Forbiddden).json({ message: 'Forbidden' });
    }
    const foundUser = await User.findOne({ _id: (decoded as any).id }).exec();

    if (!foundUser) {
      return res.status(HttpStatus.Unauthorized).json({ message: 'Unauthorized' });
    }

    const accessToken = generateAccessToken(foundUser._id )
    return res.json({ accessToken });
  });
};
