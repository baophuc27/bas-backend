import * as crypto from 'crypto';

export const randomString = (length?: number) => {
  return crypto.randomBytes(length || 40).toString('hex');
};

// Generate a unique ID using the current timestamp and a random number
export function generateUniqueDigitsId() {
  const timestamp = new Date().getTime().toString();
  const random = Math.floor(Math.random() * (999 - 111 + 1) + 111).toString();
  return random + timestamp;
}