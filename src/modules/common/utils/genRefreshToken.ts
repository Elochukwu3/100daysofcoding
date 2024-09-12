import jwt from "jsonwebtoken";

export const generateRefreshToken = (userId: string): string => {
  const secret = process.env.REFRESH_TOKEN_SECRET as string;
  return jwt.sign({ id: userId }, secret, { expiresIn: "2d" });
};
