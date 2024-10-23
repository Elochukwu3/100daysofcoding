import { Request, Response } from 'express';
import { HttpStatus } from '../../common/enums/StatusCodes';



const sendErrorResponse = (res: Response, error: unknown, defaultStatus = HttpStatus.ServerError) => {
    if (error instanceof Error) {
      const statusCode = error.name === "ValidationError" ? HttpStatus.BadRequest : defaultStatus;
      res.status(statusCode).json({ status: false, message: error.message });
    } else {
      res.status(defaultStatus).json({ status: false, message: "An unknown error occurred" });
    }
  };

  export default sendErrorResponse;