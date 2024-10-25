import { Request, Response } from "express";
import { User } from "../../auth/models/User";
import { HttpStatus } from "../../common/enums/StatusCodes";
import { validateUpdateProfileInput } from "../../user/model/Updateuser";

export const updateUserProfile = async (req: Request, res: Response) => {
  
  if(!req.user || !req.user.id){
    return res.status(HttpStatus.Unauthorized).json(
        {
            status: "failed",
            message: "Unauthorized access. No valid user found",
            statusCode: HttpStatus.Unauthorized,
        }
    );
}

  const { userId } = req.params;
  const { firstname, lastname, phoneNumber, email, address } = req.body;
  if (req.user.id !== userId) {
    return res.status(403).json({ message: "Access denied" });
  }
  const { error } = validateUpdateProfileInput(req.body);

  if (error) {
    return res.status(HttpStatus.BadRequest).json({
      status: "failed",
      message: error.details[0].message,
      statusCode: HttpStatus.BadRequest,
    });
  }
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(HttpStatus.NotFound).json({
        status: "failed",
        message: "User not found",
        statusCode: HttpStatus.NotFound,
      });
    }

    if (firstname) user.firstname = firstname;
    if (lastname) user.lastname = lastname;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (email) user.email = email;
    if (address) user.address = address;

    await user.save();
    // const { __v, _id, password, ...remData } = user.toObject();

    return res.status(HttpStatus.Success).json({
      status: "success",
      message: "Profile updated successfully",
      statusCode: HttpStatus.Success,
    });
  } catch (error) {
    return res
      .status(HttpStatus.ServerError)
      .json({ message: "Server error", error: error });
  }
};
