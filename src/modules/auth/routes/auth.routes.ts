import { Router } from "express";
import registerUser from "../controllers/registerController";
import loginUser from "../controllers/loginController";
import verifyOtp from "../controllers/verifyOtp";

const router = Router();

router.post("/register", registerUser);
router.post("/verify-otp", verifyOtp);
router.post("/login", loginUser);

export default router;
