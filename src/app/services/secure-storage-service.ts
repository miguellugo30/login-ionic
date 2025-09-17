import { Injectable } from '@angular/core';
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';

@Injectable({
  providedIn: 'root'
})
export class SecureStorageService {

  async set(key: string, value: string): Promise<void> {
    await SecureStoragePlugin.set({ key, value });
  }

  async get(key: string): Promise<string | null> {
    try {
      const result = await SecureStoragePlugin.get({ key });
      return result.value;
    } catch {
      return null;
    }
  }

  async remove(key: string): Promise<void> {
    try {
      await SecureStoragePlugin.remove({ key });
    } catch {}
  }

  async clear(): Promise<void> {
    try {
      await SecureStoragePlugin.clear();
    } catch {}
  }

}
