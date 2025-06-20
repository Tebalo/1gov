// Example cron job setup for automatic cleanup
// /api/cron/cleanup-locks/route.ts
import { NextRequest, NextResponse } from "next/server";
import { caseLockService } from "@/lib/case-lock-service";

export async function GET(request: NextRequest) {
  // Verify this is a legitimate cron request (implement your own auth)
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const cleanedCount = await caseLockService.cleanupExpiredLocks();
    
    return NextResponse.json({
      success: true,
      cleanedCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Cron cleanup failed:", error);
    return NextResponse.json(
      { error: "Cleanup failed", timestamp: new Date().toISOString() },
      { status: 500 }
    );
  }
}