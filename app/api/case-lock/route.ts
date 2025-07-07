import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        // Here you would typically call a service to handle the case lock logic
        // For example: const result = await caseLockService.lockCase(body.caseId, body.userId);
        
        // Simulating a successful lock operation
        const result = { success: true, message: "Case locked successfully" };
        
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("Error locking case:", error);
        return NextResponse.json(
            { error: "Failed to lock case" },
            { status: 500 }
        );
    }
}