import crypto from 'crypto';

export const generateOtp = async (length = 6): Promise<string> => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(length, (err, buffer) => {
      if (err) reject(err);

      // Convert the random bytes into a number string, then slice to desired length
      const otp = Array.from(buffer)
        .map(byte => (byte % 10).toString()) // Keep only digits (0-9)
        .join('')
        .slice(0, length);

      resolve(otp);
    });
  });
};
