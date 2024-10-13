import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../../common/enums/StatusCodes";
import verifyToken from "../../common/utils/verifyToken";

const verifyUserAcces = (requiredRoles = ["User", "Admin"]) => {

  return async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const HEADER = req.headers.authorization || req.headers.Authorization;

    if (typeof HEADER !== "string" || !HEADER.startsWith("Bearer ")) {
      return res.status(HttpStatus.Unauthorized).json({ message: "Unauthorized: No token provided" });
    }

    const token = HEADER.split(" ")[1];
    let decodedToken;

    try {
      decodedToken = verifyToken(token);
    } catch (error) {
 
      if (error instanceof Error) {
        if (error.name === "TokenExpiredError") {
          return res.status(HttpStatus.Unauthorized).json({ message: "Token expired" });
        } else if (error.name === "JsonWebTokenError") {
          return res.status(HttpStatus.Forbiddden).json({ message: "Invalid token" });
        }
        return res.status(HttpStatus.Forbiddden).json({ message: `Forbidden: ${error.message}` });
      }
      return res.status(HttpStatus.Forbiddden).json({ message: "An unknown error occurred" });
    }

    const userId = decodedToken.userInfo?.id;
    const roles = decodedToken.userInfo?.roles || [];

    if (!userId) {
      return res.status(HttpStatus.Unauthorized).json({ message: "Unauthorized: Invalid user" });
    }

    const hasAccess = requiredRoles.every(role => roles.includes(role));

    if (!hasAccess) {
      return res.status(HttpStatus.Forbiddden).json({ message: "Forbidden: Insufficient role privileges" });
    }

    req.user = { id: userId, roles };
    next();
  };
};

export default verifyUserAcces;
