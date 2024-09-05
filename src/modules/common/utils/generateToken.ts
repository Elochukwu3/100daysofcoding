let otpStore: { [key: string]: string } = {};

export const generateOtp = async (emailOrPhone: string): Promise<string> => {

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[emailOrPhone] = otp;

  
    return otp;
};

export const verifyOtp = async (emailOrPhone: string, otp: string): Promise<boolean> => {
    return otpStore[emailOrPhone] === otp;
};
