import { Router } from "express";
import { getUserProfile } from '../controllers/UserProfile'; // Import your controller functions
import verifyUserAcces from "../../common/middlewares/verifyaccess";
// import { updateUserProfile } from '../controllers/userController'; // Update the import paths as needed
// import { getUserOrders } from '../controllers/orderController'; // Import for orders

const router = Router();

router.use(verifyUserAcces);
router.get('/profile/', getUserProfile);
router.get('/profile/:userId', getUserProfile);

// router.put('/api/v1/profile/:userId', verifyUser, updateUserProfile);

// router.get('/api/v1/orders/:userId', verifyUser, getUserOrders);
// router.put('/api/v1/payment/:userId', verifyUser, updatePaymentInformation);


export default router;
