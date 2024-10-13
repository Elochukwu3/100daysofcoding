import { Request, Response } from "express";
import { HttpStatus } from "../../common/enums/StatusCodes";

export const setTokens = async (
    res: Response,
    accessToken: string,
    refreshToken: string,
    userId: string
  ): Promise<void> => {
    
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, 
    });
  

    res.status(HttpStatus.Success).json({
      status: "Success",
      message: "Operation successful",
      data: {
        accessToken,
        user: { userId },
      },
    });
  };