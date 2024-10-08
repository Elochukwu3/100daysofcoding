import bcrypt from "bcrypt";

export const validatePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
 

  if (!password || !hash) {
    throw new Error("Both password and hash must be provided");
  }
  return bcrypt.compare(password, hash);
};
