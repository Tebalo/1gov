import { Label } from '@/components/ui/label';
import React from 'react';

export const Text: React.FC<{label: string, value:string | null}> =({label,value}) => {
    return (
        <div>
            <Label className='text-gray-800'>
                {label}
            </Label>
            <div>
                <span>{value ? value : '--'}</span>
            </div>
        </div>
    )
}