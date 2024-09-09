import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { User } from "../models/User";
import { validateRegisterInput } from "../models/User";
import { HttpStatus } from "../../common/enums/StatusCodes";

export const registerUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { firstname, lastname, state, email, password } = req.body;
    const { error } = validateRegisterInput(req.body);
    if (error) {
      res.status(HttpStatus.BadRequest).json({
        status: "Bad request",
        message: "Registration unsuccessful",
        statusCode: HttpStatus.BadRequest,
      });
      return;
    }
    const duplicate = await User.findOne({ email }).lean().exec();

    if (duplicate) {
      res.status(HttpStatus.Conflict).json({
        status: "Conflict",
        message: "User with email already exists",
        statusCode: HttpStatus.Conflict,
      });
      return;
    }

    res.status(HttpStatus.Created).json({
      status: "Success",
      message: "User has been registered",
      statusCode: HttpStatus.Created,
    });
  }
);
