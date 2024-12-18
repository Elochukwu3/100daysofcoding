import { Router } from "express";
import registerUser from "../controllers/registerController";
import loginUser from "../controllers/loginController";
import verifyOtp from "../controllers/verifyOtp";
import {refreshToken} from "../controllers/refreshToken";
import changePassword from "../controllers/changePassword";
import verifyUserAcces from "../../common/middlewares/verifyaccess";
import verifyResetOtp from "../../auth/controllers/verifyResetOtp";
import resetPassword from "../../auth/controllers/resetPswd";
import requestPasswordReset from "../../auth/controllers/reqResetPswd";
import otpSessionConfig from "../../common/config/otpSessionConfig";
import { otpRateLimiter } from "../../auth/utils/limiter";
import newRegistrationOtp from "../../auth/controllers/sendNewregOtp";


const router = Router();
router.use(otpSessionConfig);

router.post("/register", registerUser);
router.post("/verify-otp", verifyOtp);
router.post("/login", loginUser);
router.post("/refresh-token", refreshToken);
router.post('/generate-otp', otpRateLimiter, newRegistrationOtp);

router.use(verifyUserAcces(["User", "Admin"])); 
router.patch("/change-password", changePassword);
router.post("/request-password-reset", requestPasswordReset);
router.post("/verify-reset-otp", verifyResetOtp);
router.post("/reset-password",  resetPassword);


export default router;
