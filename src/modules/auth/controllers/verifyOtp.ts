import { Request, Response } from 'express';
import { Token } from "../models/token";

interface VerifyOtpRequestBody {
    token: string;
  }
const verifyOtp = async (req: Request< {},{}, VerifyOtpRequestBody>, res: Response): Promise<Response | undefined> => {
    try {
const { token } = req.body
// req.body as unknown as { token: string };
    //    
        // Find the token in the database
        const existingToken = await Token.findOne({ token });
      
        if (!existingToken || existingToken.purpose !== "email_verification") {
          throw new Error("Invalid token");
        }
        
        // Check if the token is expired
        if (new Date(existingToken.expiresAt) <= new Date()) {
          console.log(new Date(existingToken.expiresAt));
          await existingToken.deleteOne();
          throw new Error("Token expired");
        }
      
        // waiting for user model @favour
        // const existingUser = await UserModel.findOne({ email: existingToken.email });
        // if (!existingUser) {
        //   throw new Error("Invalid token");
        // }
        // const updateDatabase = await UserModel.findOneAndUpdate(
        //   { email: existingToken.email },
        //   { verified: true },
        //   { new: true, runValidators: true }
        // );
        // await existingToken.deleteOne();
      
        return res.status(200).json({ message: "user verified", update: 'updateDatabase' });

     
    } catch (error) {
        return res
      .status(500)
      .json({
        status: "Bad request",
        message: "Internal server error",
        error,
        statusCode: "500",
      });
    }
};
 export default verifyOtp;