import { User } from "@auth/models/User";
import { HttpStatus } from "../../common/enums/StatusCodes";
import { Request, Response } from "express";

export const getUserProfile = async (req: Request, res: Response) => {

    try{
        if(!req.user || !req.user.id){
            return res.status(HttpStatus.Unauthorized).json(
                {
                    status: "failed",
                    message: "Unauthorized access. No valid user found",
                    statusCode: HttpStatus.Unauthorized,
                }
            );
        }
  
        const userProfile = await User.findById(req.user.id).select("-password");
        if(!userProfile){
            return res.status(HttpStatus.NotFound).json(
                {
                    status: "failed",
                    message: "User not found",
                    statusCode: HttpStatus.NotFound,
                }
            );
        }
        const userObject = userProfile.toObject();

        const { __v, _id, password: pwd, ...remDetails } = userObject;
        res.status(HttpStatus.Success).json(
            {
                status: "success",
                data: remDetails,
                statusCode: HttpStatus.Success,
            }
        );
     
    }catch(err){

    }
};
