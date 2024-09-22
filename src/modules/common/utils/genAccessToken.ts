  import jwt from "jsonwebtoken";

  export const generateAccessToken = (userId: string): string => {
    const secret = process.env.ACCESS_TOKEN_SECRET as string;
    return jwt.sign({ id: userId }, secret, { expiresIn: "15m" });
  };
