import crypto from 'crypto-js';
import {ENCRYPTION_KEY} from '@env';

/**
 * Encrypt given string
 */
const encrypt = (data: string) => {
  if (!data) return false;

  try {
    return crypto.AES.encrypt(data, ENCRYPTION_KEY).toString();
  } catch (e: any) {
    return false;
  }
};

/**
 * Decrypt encrypted data
 */
const decrypt = (encryptedData: string) => {
  if (!encryptedData) return false;
  try {
    var bytes = crypto.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    var originalData = bytes.toString(crypto.enc.Utf8);
    return originalData;
  } catch (e) {
    return false;
  }
};

export {encrypt, decrypt};
