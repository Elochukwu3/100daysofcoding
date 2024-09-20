import { Router } from "express";
import registerUser from "../controllers/registerController";
import loginUser from "../controllers/loginController";
import verifyOtp from "../controllers/verifyOtp";
// import refreshToken from "../controllers/refreshToken";
// import changePassword from "../controllers/changePassword";

const router = Router();


router.post("/register", registerUser);
router.post("/verify-otp", verifyOtp);
router.post("/login", loginUser);
// router.post("/refresh-token", refreshToken);
// router.post("/change-password", changePassword);

export default router;
