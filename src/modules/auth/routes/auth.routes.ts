
import { Router, Request, Response } from 'express';
import getOtp from '../controllers/getOtp';
import verifyOtp from '../controllers/verifyOtp';

const router = Router();


router.get('/get-otp', getOtp)
router.post('/verify-otp', verifyOtp)

export default router;
