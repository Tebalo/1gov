// /lib/utils/lock-status-storage.ts
// Utility for storing lock status in memory (not localStorage due to restrictions)
class LockStatusStore {
  private store = new Map<string, any>();

  set(key: string, value: any): void {
    this.store.set(key, value);
  }

  get(key: string): any {
    return this.store.get(key);
  }

  remove(key: string): boolean {
    return this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  has(key: string): boolean {
    return this.store.has(key);
  }
}

export const lockStatusStore = new LockStatusStore();