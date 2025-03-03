'use server'

import { revalidateTag } from "next/cache"

export async function refreshRegistrations() {
    try {
        revalidateTag('teacher-registrations');

        return { 
            success: true,
            message: 'Registrations refreshed successfully',
            refreshedAt: new Date().toISOString(), 
        };
    } catch (error) {
        console.error('Error refreshing registrations:', error);
        return { 
            success: false, 
            error: error instanceof Error ? error.message : 'Failed to connect..'
        };
    }
}