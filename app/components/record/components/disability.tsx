import { Label } from '@/components/ui/label';
import Props from './types';
export const Disability: React.FC<Props> = (data: Props) => {
    return(
        <div className='h-full w-full'>
            <div className='grid md:grid-cols-1 gap-y-5'>
                <div className='flex flex-col space-y-1'>
                    <Label>Are you living with any form of disability:</Label>
                    <span className='font-light text-sm'>{data?.bio_datas?.disability}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Nature of Disability:</Label>
                    <span className='font-light text-sm'>{data?.bio_datas?.disability_description}</span>
                </div>
            </div>
        </div>
    );
}