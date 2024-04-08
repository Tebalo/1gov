import { Label } from '@/components/ui/label';
import Props from './types';

export const StudentPreliminary: React.FC<Props> = (pre: Props) => {
    return(
        <div className='h-full w-full'>
            <div className='grid md:grid-cols-2 m-10 gap-y-5'>
                <div className='flex flex-col space-y-1'>
                    <Label>Application Type:</Label>
                    <span className='font-light text-sm'>{pre?.teacher_registrations?.registration_type}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Citenzry:</Label>
                    <span className='font-light text-sm'>{pre?.student_preliminary_infos?.citizenry}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Institution name:</Label>
                    <span className='font-light text-sm'>{pre?.student_preliminary_infos?.institution_name}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Institution type:</Label>
                    <span className='font-light text-sm'>{pre?.student_preliminary_infos?.institution_type}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Study area:</Label>
                    <span className='font-light text-sm'>{pre?.student_preliminary_infos.study_area}</span>
                </div>
            </div>
        </div>
    );
}