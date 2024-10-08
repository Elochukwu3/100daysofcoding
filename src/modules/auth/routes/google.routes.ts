import express, { Request, Response, Router } from "express";
import passport from "passport";
import { HttpStatus } from "../../common/enums/StatusCodes";
import googleAuthSessionConfig from "../../common/config/googleSessionConfig";

const router = Router();

router.use(googleAuthSessionConfig);

// Route to initiate Google authentication
router.get(
  "/",
  passport.authenticate("google", {
    scope: [
      "profile",
      "email",
      "https://www.googleapis.com/auth/contacts.readonly",
    ],
  })
);

// Callback route after authentication
router.get(
  "/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/v1/google/failure",
  }),
  async (req: Request, res: Response) => {
    res.redirect("/auth/v1/google/success");
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
