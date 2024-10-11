import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../enums/StatusCodes";

const verifyRoles = (...allowedRoles: number[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const roles = req.user ? req.user.roles : null;
    if (!roles)
      return res.status(HttpStatus.Unauthorized).json({
        status: "Failed",
        message: "User Unauthorized",
        statusCode: HttpStatus.Unauthorized,
      });
    const rolesArray = [...allowedRoles];
    console.log(rolesArray);
    console.log(roles);
    const result = roles
      .map((role) => rolesArray.includes(role))
      .find((val) => val === true);
    if (!result)
      return res.status(HttpStatus.Unauthorized).json({
        status: "Failed",
        message: "User Unauthorized",
        statusCode: HttpStatus.Unauthorized,
      });
    next();
  };
};

export default verifyRoles;
