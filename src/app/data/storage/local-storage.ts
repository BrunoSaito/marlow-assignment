import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoJS from 'crypto-js';

const SECRET = 'secret';

export const localDataSource = {
  getItem: async <T>(key: string): Promise<T | null> => {
    const shakey = CryptoJS.SHA3(key).toString();
    const value = await AsyncStorage.getItem(shakey);

    if (!value) {
      return null;
    }
    const response = CryptoJS.AES.decrypt(
      value,
      SECRET,
    ).toString(CryptoJS.enc.Utf8);

    try {
      return JSON.parse(response);
    } catch {
      return null;
    }
  },

  setItem: async (key: string, value: any): Promise<void> => {
    const shakey = CryptoJS.SHA3(key).toString();
    const cryptoValue = CryptoJS.AES.encrypt(
      JSON.stringify(value),
      SECRET,
    ).toString();

    if (shakey === undefined || cryptoValue === undefined) {
      throw new Error('undefined key or value');
    }

    await AsyncStorage.setItem(shakey, cryptoValue);
  },

  removeItem(key: string): Promise<void> {
    const shakey = CryptoJS.SHA3(key).toString();
    return AsyncStorage.removeItem(shakey);
  },
};
