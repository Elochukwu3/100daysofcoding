import { HttpStatus } from './../../common/enums/StatusCodes';
import { Request, Response } from "express";
import { User } from "../../auth/models/User";
import { validateUpdateProfileInput } from "../../user/model/Updateuser";

export const updateUserProfile = async (req: Request, res: Response) => {
    // Check if user is authenticated
    if (!req.user || !req.user.id) {
        return res.status(HttpStatus.Unauthorized).json({
            status: "failed",
            message: "Unauthorized access. No valid user found",
            statusCode: HttpStatus.Unauthorized,
        });
    }

    const { userId } = req.params;
    const { firstname, lastname, phoneNumber, email, address, gender } = req.body;

    // Verify the user is authorized to update the profile
    if (req.user.id !== userId) {
        return res.status(HttpStatus.Forbiddden).json({
            status: "failed",
            message: "Access denied",
            statusCode: HttpStatus.Forbiddden,
        });
    }

    // Validate input
    const { error } = validateUpdateProfileInput({ firstname, lastname, phoneNumber, email, address });
    if (error) {
        return res.status(HttpStatus.BadRequest).json({
            status: "failed",
            message: error.details[0].message,
            statusCode: HttpStatus.BadRequest,
        });
    }

    // Validate gender
    if (gender && gender.toLowerCase() !== "male" && gender.toLowerCase() !== "female") {
        return res.status(HttpStatus.BadRequest).json({
            status: "Validation failed",
            message: {
                field: "gender",
                details: `${gender} is not a valid option. Please enter either 'male' or 'female' as the gender`,
            },
            statusCode: HttpStatus.BadRequest,
        });
    }

    try {
        // Find the user in the database
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(HttpStatus.NotFound).json({
                status: "failed",
                message: "User not found",
                statusCode: HttpStatus.NotFound,
            });
        }

        // Define allowed fields and validate input
        const allowedFields = ["firstname", "lastname", "phoneNumber", "email", "address", "gender"];
        const invalidFields = Object.keys(req.body).filter((key) => !allowedFields.includes(key));

        if (invalidFields.length > 0) {
            return res.status(HttpStatus.BadRequest).json({
                status: "failed",
                message: `Invalid fields: ${invalidFields.join(", ")}`,
                statusCode: HttpStatus.BadRequest,
            });
        }

        // Prepare updates
        const updates: Record<string, any> = {};
        allowedFields.forEach((field) => {
            if (req.body[field]) updates[field] = req.body[field];
        });

        // Normalize gender
        if (updates.gender) {
            updates.gender = updates.gender.toLowerCase();
        }

        // Update user data
        Object.assign(user, updates);
        await user.save();

        return res.status(HttpStatus.Success).json({
            status: "success",
            message: "Profile updated successfully",
            statusCode: HttpStatus.Success,
        });
    } catch (error) {
        return res.status(HttpStatus.ServerError).json({
            status: "failed",
            message: "Server error",
            error: error,
            statusCode: HttpStatus.ServerError,
        });
    }
};



// import { HttpStatus } from './../../common/enums/StatusCodes';
// import { Request, Response } from "express";
// import { User } from "../../auth/models/User";
// import { validateUpdateProfileInput } from "../../user/model/Updateuser";

// export const updateUserProfile = async (req: Request, res: Response) => {
  
//   if(!req.user || !req.user.id){
//     return res.status(HttpStatus.Unauthorized).json(
//         {
//             status: "failed",
//             message: "Unauthorized access. No valid user found",
//             statusCode: HttpStatus.Unauthorized,
//         }
//     );
// }

//   const { userId } = req.params;
//   const { firstname, lastname, phoneNumber, email, address, gender } = req.body;
//   if (req.user.id !== userId) {
//     return res.status(403).json({ message: "Access denied" });
//   }
//   const { error } = validateUpdateProfileInput({firstname, lastname, phoneNumber, email, address});

//   if (error) {
//     return res.status(HttpStatus.BadRequest).json({
//       status: "failed",
//       message: error.details[0].message,
//       statusCode: HttpStatus.BadRequest,
//     });
//   }
//   if (gender &&  gender.toLowerCase() !== "male" &&  gender.toLowerCase() !== "female" ) {
//     return res.status(HttpStatus.BadRequest).json({
//       status : "Validation failed",
//       "message": {
//         "field": "gender",
//         "details": `${gender} is not a valid option. Please enter either 'male' or 'female' as the gender`
//       }
//     }
//     )
//   }
  
//   try {
//     const user = await User.findById(req.user.id);
//     if (!user) {
//       return res.status(HttpStatus.NotFound).json({
//         status: "failed",
//         message: "User not found",
//         statusCode: HttpStatus.NotFound,
//       });
//     }
//     const allowedFields = ["firstname", "lastname", "phoneNumber", "email", "address", "gender"];
// const invalidFields = Object.keys(req.body).filter((key) => !allowedFields.includes(key));

// if (invalidFields.length > 0) {
//   return res.status(HttpStatus.BadRequest).json({
//     status: "failed",
//     message: `Invalid fields: ${invalidFields.join(", ")}`,
//     statusCode: HttpStatus.BadRequest,
//   });
// }


//     const updates: Record<string, any> = {};
// allowedFields.forEach((field) => {
//   if (req.body[field]) updates[field] = req.body[field];
// });

// if (updates.gender) {
//   const gender = updates.gender.toLowerCase();
//   if (gender !== "male" && gender !== "female") {
//       return res.status(HttpStatus.BadRequest).json({
//           status: "Validation failed",
//           message: {
//               field: "gender",
//               details: `${updates.gender} is not a valid option. Please enter either 'male' or 'female' as the gender`,
//           },
//       });
//   }
//   updates.gender = gender;
// }

// Object.assign(user, updates);
// await user.save();

//     return res.status(HttpStatus.Success).json({
//       status: "success",
//       message: "Profile updated successfully",
//       statusCode: HttpStatus.Success,
//     });
//   } catch (error) {
//     return res
//       .status(HttpStatus.ServerError)
//       .json({ message: "Server error", error: error });
//   }
// };
