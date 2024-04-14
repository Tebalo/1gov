import { Label } from '@/components/ui/label';
import Props from './types';
export const Employment: React.FC<Props> = (data: Props) => {
    return(
        <div className='h-full w-full'>
            <div className='grid md:grid-cols-3 gap-y-5'>
                 <div className='flex flex-col space-y-1'>
                    <Label>Years in service:</Label>
                    <span className='font-light text-sm'>{data.employment_details?.experience_years}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Type of institution:</Label>
                    <span className='font-light text-sm'>{data.employment_details?.institution_type}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Current station/institution:</Label>
                    <span className='font-light text-sm'>{data.employment_details?.current_institution}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Region:</Label>
                    <span className='font-light text-sm'>{data.employment_details?.region}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>District:</Label>
                    <span className='font-light text-sm'>{data.employment_details?.district}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>City/Town/Village:</Label>
                    <span className='font-light text-sm'>{data.employment_details?.city_or_town}</span>
                </div>
            </div>
        </div>
    );
}