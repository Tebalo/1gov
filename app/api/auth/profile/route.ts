import { NextResponse } from 'next/server'
import { getAccessGroups } from '@/app/auth/auth' 

export async function GET() {
  try {
    const accessGroups = await getAccessGroups()
    
    if (!accessGroups) {
      return NextResponse.json(
        { error: 'No access groups found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(accessGroups)
  } catch (error) {
    console.error('Error fetching access groups:', error)
    return NextResponse.json(
      { error: 'Failed to fetch access groups' },
      { status: 500 }
    )
  }
}