import { Label } from '@/components/ui/label';
import Props from './types';
import { Separator } from '@/components/ui/separator';
export const Declaration: React.FC<Props> = (data: Props) => {
    return(
        <div className='h-full w-full'>
            <div className='grid grid-cols-2 gap-y-5 gap-x-5 mb-2'>
                {data?.declarations?.cpd && <div className='flex flex-col space-y-1'>
                    <Label>Continuing Professional Development (CPD)</Label>
                    <span className='font-light text-sm'>{data?.declarations?.cpd}</span>
                </div>}
                {data?.declarations?.pro_behaviour && <div className='flex flex-col space-y-1'>
                    <Label>Professional Behaviour</Label>
                    <span className='font-light text-sm'>{data?.declarations?.pro_behaviour}</span>
                </div>}
                {data?.declarations?.teaching_standards && <div className='flex flex-col space-y-1'>
                    <Label>Teaching Standards</Label>
                    <span className='font-light text-sm'>{data?.declarations?.teaching_standards}</span>
                </div>}
            </div>
            <Separator/>
            <div className='grid grid-cols-1 gap-y-5 gap-x-5 my-2'>
                <div className='flex flex-col space-y-1'>
                    <Label>I <span className='italic'>{data?.declarations?.signature}</span> hereby declare that the information I have provided in this application form is true and correct to the best of my knowledge and belief. I understand that providing false or misleading information may result in the refusal of my application or the cancellation of my registration. I am aware that the Council may collect and verify information about my qualifications, experience, and fitness to teach. I consent to the Council collecting and verifying this information and I authorize the Council to share this information with other relevant organizations, such as employers and educational institutions.</Label>
                </div>
                <Separator/>
                <div className='flex flex-col space-y-1'>
                    <Label>Accept the above terms and conditions</Label>
                    <span className='font-light text-sm'>Yes</span>
                </div>
                <Separator/>
                <div className='flex flex-col space-y-1'>
                    <Label>I agree to submit the listed profile information along with this application.</Label>
                    <span className='font-light text-sm'>Yes</span>
                </div>
            </div>
        </div>
    );
}
