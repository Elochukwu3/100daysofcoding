import jwt from "jsonwebtoken";

const verifyToken = (token: string): any => {
    try {
      const secret = process.env.ACCESS_TOKEN_SECRET as string;
      return jwt.verify(token, secret);
    } catch (err) {
      throw new Error('Invalid token');
    }
  };
  export default verifyToken;