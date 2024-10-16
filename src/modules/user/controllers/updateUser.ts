import { Request, Response } from "express";
import { User } from "../../auth/models/User";
import { HttpStatus } from "../../common/enums/StatusCodes";
import { validateUpdateProfileInput } from "../../user/model/Updateuser";

export const updateUserProfile = async (req: Request, res: Response) => {
  const { error } = validateUpdateProfileInput(req.body);

  if (error) {
    return res
      .status(HttpStatus.BadRequest)
      .json({
        status: "failed",
        message: error.details[0].message,
        statusCode: HttpStatus.BadRequest,
      });
  }

  const { userId } = req.params;
  const { firstname, lastname, phoneNumber, email, address } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(HttpStatus.NotFound).json({
        status: "failed",
        message: "User not found",
        statusCode: HttpStatus.NotFound,
      });
    }

    if (firstname) user.firstname = firstname;
    if (lastname) user.lastname = lastname;
    if (phoneNumber) user.phonenumber = phoneNumber;
    if (email) user.email = email;
    if (address) user.address = address;

    await user.save();
    const { __v, _id, password, ...remData } = user.toObject();

    return res.status(HttpStatus.Success).json({
      status: "success",
      message: "Profile updated successfully",
      data: remData,
      statusCode: HttpStatus.Success,
    });
  } catch (error) {
    return res
      .status(HttpStatus.ServerError)
      .json({ message: "Server error", error: error });
  }
};
