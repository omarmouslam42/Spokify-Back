import bcrypt from "bcryptjs";

export const hash = async ({ plaintext, salt = process.env.SALT_ROUNDS } = {}) => {
  const hashResult = await bcrypt.hash(plaintext, parseInt(salt));
  return hashResult;
};

export const compare = async ({ plaintext, hashValue } = {}) => {
  const result = await bcrypt.compare(plaintext, hashValue);
  return result;
};