import { draftService } from "@/lib/draft-service";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
){
    try{
        const draftId = params.id;
        const { fields } = await request.json();    
        if(!draftId){
            return NextResponse.json(
                { error: 'Draft ID is required' },
                { status: 400 }
            );
        }
        if(!fields){
            return NextResponse.json(
                { error: 'Fields data is required' },
                { status: 400 }
            );
        }
        const updatedDraft = await draftService.updateDraftCorrectionFields(draftId, fields);
        if(!updatedDraft){
            return NextResponse.json(
                { error: 'Draft not found' },
                { status: 404 }
            );
        }
        return NextResponse.json(updatedDraft);
    }catch (error) {
        return NextResponse.json(
            { error: 'Failed to update draft fields' },
            { status: 500 }
        );
    }
}