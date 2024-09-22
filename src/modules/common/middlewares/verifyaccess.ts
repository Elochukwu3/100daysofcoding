    import { Request, Response, NextFunction } from "express";
    import { User } from "../../auth/models/User";
    import { HttpStatus } from "../../common/enums/StatusCodes";
    import verifyToken from "../../common/utils/verifyToken";

   const changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    
      const HEADER = req.headers.authorization || req.headers.Authorization;
    
      if (typeof HEADER !== 'string' || !HEADER.startsWith('Bearer ')) {
        res.status(HttpStatus.Unauthorized).json({ message: "Unauthorized: No token provided" });
        return;
      }
    
      const token = HEADER.split(' ')[1];
    
  
      let decodedToken;
      try {
        decodedToken = verifyToken(token);
      } catch (error) {
        res.status(HttpStatus.Forbiddden).json({ status:"Bad request", message: "Forbidden: Invalid token" });
        return;
      }
    
      const userId = decodedToken.id;
      if (!userId) {
        res.status(HttpStatus.Unauthorized).json({status:"Bad request", message: "Unauthorized: Invalid user" });
        return;
      }
    
     
      const user = await User.findById(userId).exec();
      if (!user) {
        res.status(HttpStatus.NotFound).json({status:"Bad request", message: "User not found" });
        return;
      }
      //will add verification b y role too.
      res.status(HttpStatus.Success).json({ message: "Password updated successfully" });
    };
    
    export default changePassword;
    

      // Implement JWT verification logic here
    // Check if the user is authenticated and has the required role
    // If the user is authenticated and has the required role, call next() to proceed with the request
    // If the user is not authenticated or does not have the required role, respond with an appropriate error message