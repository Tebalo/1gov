import { Label } from "@/components/ui/label";
import Props from './types';
export const StudyProgramme: React.FC<Props> = (data: Props) => {
    return(
        <div className='h-full w-full'>
            <div className='grid md:grid-cols-3 gap-y-5'>
                 <div className='flex flex-col space-y-1'>
                    <Label>Programme level:</Label>
                    <span className='font-light text-sm'>{data?.student_study_programmes?.level}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Name of programme:</Label>
                    <span className='font-light text-sm'>{data?.student_study_programmes?.name}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Duration(In Years):</Label>
                    <span className='font-light text-sm'>{data?.student_study_programmes?.duration}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Expected year of completion:</Label>
                    <span className='font-light text-sm'>{data?.student_study_programmes?.completion_year}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Mode of study:</Label>
                    <span className='font-light text-sm'>{data?.student_study_programmes?.mode_of_study}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Subject specialization (Junior&Sec):</Label>
                    <span className='font-light text-sm'>{data?.student_study_programmes?.specialization}</span>
                </div>
            </div>
        </div>
    );
}