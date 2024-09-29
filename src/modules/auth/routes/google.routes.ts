import express, { Request, Response, Router } from "express";
import passport from "passport";
import { HttpStatus } from "../../common/enums/StatusCodes";

const router = Router();

// Route to initiate Google authentication
router.get(
  "/",
  passport.authenticate("google", {
    scope: [
      "profile",
      "email",
      "https://www.googleapis.com/auth/user.phonenumbers.read",
    ],
  })
);

// Callback route after authentication
router.get(
  "/callback",
  passport.authenticate("google", {
    failureRedirect: "/failure",
  }),
  async (req: Request, res: Response) => {
    res.redirect("/success");
  }
);

router.get("/failure", (req: Request, res: Response) => {
  return res.status(HttpStatus.ServerError).json({
    status: "Server Error",
    message: "Login Failed",
    statuscode: HttpStatus.ServerError,
  });
});

router.get("/success", (req: Request, res: Response) => {
  const { accessToken } = req.user as any;
  return res.status(HttpStatus.Success).json({
    status: "Success",
    message: "Login Successful",
    user: req.user,
    accessToken,
    statuscode: HttpStatus.Success,
  });
});

export default router;
