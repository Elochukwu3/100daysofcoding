import { Response, Request, NextFunction } from "express";
import { HttpStatus } from "../../common/enums/StatusCodes";

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(HttpStatus.ServerError).json({
      status: "failed",
      message: "Internal Server Error",
      error: {
        message: err.message,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }) 
      }
    });
  };

  export default errorHandler;