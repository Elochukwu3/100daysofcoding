import jwt from "jsonwebtoken";

export const generateAccessToken = (
  userId: string,
  roles: number[]
): string => {
  const secret = process.env.ACCESS_TOKEN_SECRET as string;
  return jwt.sign(
    {
      userInfo: {
        id: userId,
        roles,
      },
    },
    secret,
    { expiresIn: "15m" }
  );
};
