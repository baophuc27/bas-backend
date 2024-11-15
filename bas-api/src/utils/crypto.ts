import crypto from 'crypto';

export const encrypt = (text: string, key: string): string => {
  const cipher = crypto.publicEncrypt({
    key: key,
    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    oaepHash: 'sha256',
  }, Buffer.from(text));
  return cipher.toString('base64');
};

export const decrypt = (text: string, key: string): string => {
  const decipher = crypto.privateDecrypt({
    key: key,
    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    oaepHash: 'sha256',
  }, Buffer.from(text, 'base64'));
  return decipher.toString();
};