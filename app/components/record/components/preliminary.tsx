import { Label } from '@/components/ui/label';
import Props from './types';

export const Preliminary: React.FC<Props> = (pre: Props) => {
    return(
        <div className='h-full w-full'>
            <div className='grid md:grid-cols-2 gap-y-5'>
                <div className='flex flex-col space-y-1'>
                    <Label>Application Type:</Label>
                    <span className='font-light text-sm'>{pre?.teacher_registrations?.registration_type}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Work status:</Label>
                    <span className='font-light text-sm'>{pre?.teacher_preliminary_infos?.work_status}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Practice category:</Label>
                    <span className='font-light text-sm'>{pre?.teacher_preliminary_infos?.practice_category}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Practice sub-category:</Label>
                    <span className='font-light text-sm'>{pre?.teacher_preliminary_infos?.sub_category}</span>
                </div>
            </div>
        </div>
    );
}