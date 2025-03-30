import { AES, enc } from "crypto-js";

const encrypt = (data: any, key: string) => {
  return AES.encrypt(data, key).toString();
};

const decrypt = (encryptedData: string, key: string) => {
  return AES.decrypt(encryptedData, key).toString(enc.Utf8);
};

export { encrypt, decrypt };
