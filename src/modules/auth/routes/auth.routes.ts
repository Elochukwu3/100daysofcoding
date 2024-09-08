
import { Router, Request, Response } from 'express';
import getOtp from '../controllers/getOtp';

const router = Router();


router.get('/get-otp', getOtp)

export default router;
