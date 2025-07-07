// /lib/utils/case-lock-cleanup.ts

import { caseLockService } from "./case-lock-service";


export class CaseLockCleanup {
  private static instance: CaseLockCleanup;
  private cleanupInterval: NodeJS.Timeout | null = null;

  private constructor() {}

  static getInstance(): CaseLockCleanup {
    if (!CaseLockCleanup.instance) {
      CaseLockCleanup.instance = new CaseLockCleanup();
    }
    return CaseLockCleanup.instance;
  }

  // Start automatic cleanup of expired locks
  startAutoCleanup(intervalMinutes: number = 15): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }

    this.cleanupInterval = setInterval(async () => {
      try {
        const cleanedCount = await caseLockService.cleanupExpiredLocks();
        if (cleanedCount > 0) {
          console.log(`Cleaned up ${cleanedCount} expired locks`);
        }
      } catch (error) {
        console.error('Error during lock cleanup:', error);
      }
    }, intervalMinutes * 60 * 1000);

    console.log(`Started automatic lock cleanup every ${intervalMinutes} minutes`);
  }

  // Stop automatic cleanup
  stopAutoCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
      console.log('Stopped automatic lock cleanup');
    }
  }

  // Manual cleanup function
  async performCleanup(): Promise<number> {
    try {
      const cleanedCount = await caseLockService.cleanupExpiredLocks();
      console.log(`Manual cleanup completed: ${cleanedCount} locks removed`);
      return cleanedCount;
    } catch (error) {
      console.error('Error during manual cleanup:', error);
      throw error;
    }
  }
}












