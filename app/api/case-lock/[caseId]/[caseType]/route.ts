// /app/api/case-lock/[caseId]/[caseType]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { caseLockService } from "@/lib/case-lock-service";

interface RouteParams {
  params: {
    caseId: string;
    caseType: string;
  };
}

// GET - Check lock status
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { caseId, caseType } = params;
    
    const lockDetails = await caseLockService.getLockDetails(caseId, caseType);
    
    return NextResponse.json({
      isLocked: !!lockDetails,
      lockDetails,
    });
  } catch (error) {
    console.error("Error checking lock status:", error);
    return NextResponse.json(
      { error: "Failed to check lock status" },
      { status: 500 }
    );
  }
}

// POST - Acquire lock
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { caseId, caseType } = params;
    const body = await request.json();
    const { lockedBy, reason, metadata } = body;

    if (!lockedBy) {
      return NextResponse.json(
        { error: "lockedBy is required" },
        { status: 400 }
      );
    }

    const result = await caseLockService.acquireLock(
      caseId,
      caseType,
      lockedBy,
      reason,
      metadata
    );

    if ('error' in result) {
      return NextResponse.json(result, { status: 409 }); // Conflict
    }

    return NextResponse.json({
      success: true,
      lock: result,
    });
  } catch (error) {
    console.error("Error acquiring lock:", error);
    return NextResponse.json(
      { error: "Failed to acquire lock" },
      { status: 500 }
    );
  }
}

// DELETE - Release lock
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { caseId, caseType } = params;
    const { searchParams } = new URL(request.url);
    const lockedBy = searchParams.get('lockedBy');
    const force = searchParams.get('force') === 'true';

    if (!lockedBy && !force) {
      return NextResponse.json(
        { error: "lockedBy parameter is required" },
        { status: 400 }
      );
    }

    let success;
    if (force) {
      success = await caseLockService.forceReleaseLock(caseId, caseType);
    } else {
      success = await caseLockService.releaseLock(caseId, caseType, lockedBy!);
    }

    return NextResponse.json({
      success,
      message: success ? "Lock released successfully" : "No lock found to release",
    });
  } catch (error) {
    console.error("Error releasing lock:", error);
    return NextResponse.json(
      { error: "Failed to release lock" },
      { status: 500 }
    );
  }
}

// PUT - Extend lock
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { caseId, caseType } = params;
    const body = await request.json();
    const { lockedBy, additionalMinutes = 30 } = body;

    if (!lockedBy) {
      return NextResponse.json(
        { error: "lockedBy is required" },
        { status: 400 }
      );
    }

    const result = await caseLockService.extendLock(
      caseId,
      caseType,
      lockedBy,
      additionalMinutes
    );

    if (!result) {
      return NextResponse.json(
        { error: "No active lock found for this user" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      lock: result,
    });
  } catch (error) {
    console.error("Error extending lock:", error);
    return NextResponse.json(
      { error: "Failed to extend lock" },
      { status: 500 }
    );
  }
}