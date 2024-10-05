    import { Request, Response, NextFunction } from "express";
    import { HttpStatus } from "../../common/enums/StatusCodes";
    import verifyToken from "../../common/utils/verifyToken";
   

   const verifyUserAcces = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    
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
    
      req.user = { id: userId };
      next();
    };
    
    export default verifyUserAcces ;
    

      // Implement JWT verification logic here
    // Check if the user is authenticated and has the required role
    // If the user is authenticated and has the required role, call next() to proceed with the request
    // If the user is not authenticated or does not have the required role, respond with an appropriate error message