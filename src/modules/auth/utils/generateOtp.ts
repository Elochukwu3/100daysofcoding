let otpStore: { [key: string]: string } = {};

export const generateOtp = async (): Promise<string> => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    return otp;
};

