// src/modules/auth/controllers/auth.controller.ts

import { Request, Response } from 'express';
// import { generateOtp, verifyOtp } from '../services/auth.service'; // Implement these services as needed

export const getOtp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { emailOrPhone } = req.query;

        if (!emailOrPhone || typeof emailOrPhone !== 'string') {
            res.status(400).json({ message: 'Invalid request' });
            return;
        }

        // Generate and send OTP
        // const otp = await generateOtp(emailOrPhone);
        // Send OTP via email or SMS here (implementation depends on your setup)

        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
};

