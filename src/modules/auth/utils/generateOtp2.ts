import crypto from 'crypto';


export const generateOtp = async (length = 6): Promise<string> => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(length, (err, buffer) => {
      if (err) reject(err);
      const otp = buffer.toString('hex').slice(0, length).toUpperCase(); // Change to upper case if desired
      resolve(otp);
    });
  });
};
