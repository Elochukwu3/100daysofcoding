import { Router } from "express";
import { getUserProfile } from "../controllers/UserProfile"; // Import your controller functions
import verifyUserAcces from "../../common/middlewares/verifyaccess";
import { updateUserProfile } from "../controllers/updateUser";
import verifyRoles from "../../common/middlewares/verifyRoles";
import { Roles } from "../../common/enums/roles";

const router = Router();

router.use(verifyUserAcces);
router.get("/profile/", verifyRoles(Roles.Admin), getUserProfile);
router.get("/profile/:userId", getUserProfile);
router.patch("/profile/:userId", updateUserProfile);

// router.get('/api/v1/orders/:userId', verifyUser, getUserOrders);
// router.put('/api/v1/payment/:userId', verifyUser, updatePaymentInformation);

export default router;
