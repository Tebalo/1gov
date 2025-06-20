// /api/case-lock/cleanup/route.ts
import { NextRequest, NextResponse } from "next/server";
import { caseLockService } from "@/lib/case-lock-service";

export async function POST(request: NextRequest) {
  try {
    const cleanedCount = await caseLockService.cleanupExpiredLocks();
    
    return NextResponse.json({
      success: true,
      cleanedCount,
      message: `Cleaned up ${cleanedCount} expired locks`,
    });
  } catch (error) {
    console.error("Error during cleanup:", error);
    return NextResponse.json(
      { error: "Failed to cleanup expired locks" },
      { status: 500 }
    );
  }
}