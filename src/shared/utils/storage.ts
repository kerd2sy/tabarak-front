import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const SECURE_KEYS: string[] = [];
const SENSITIVE_PATTERNS: RegExp[] = [];
const isSensitive = (key: string) => false;

const memCache: Record<string, string> = {};

export const storage = {
  getItemSync: (key: string): string | null => {
    return memCache[key] || null;
  },
  
  getItem: async (key: string): Promise<string | null> => {
    if (memCache[key]) return memCache[key];
    try {
      const val = await AsyncStorage.getItem(key);
      if (val) memCache[key] = val;
      return val;
    } catch (error) {
      console.error(`[Storage] Failed to get item ${key}:`, error);
      return null;
    }
  },
  
  setItem: async (key: string, value: string): Promise<void> => {
    memCache[key] = value;
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error(`[Storage] Failed to set item ${key}:`, error);
    }
  },
  
  deleteItem: async (key: string): Promise<void> => {
    delete memCache[key];
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`[Storage] Failed to delete item ${key}:`, error);
    }
  }
};
