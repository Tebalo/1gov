import { Label } from '@/components/ui/label';
import Props from './types';
export const Offence: React.FC<Props> = (data:Props) => {
    return(
        <div className='h-full w-full'>
            <div className='grid md:grid-cols-2 gap-y-5 gap-x-5'>
                <div className='flex flex-col space-y-1'>
                    <Label>1. Have you been convicted of, or entered a plea of guilty or no contest to, or a criminal offense against a learner/ a minor?:</Label>
                    <span className='font-light text-sm'>{data?.offence_convictions?.drug_related_offence}, {data?.offence_convictions?.drug_related_offence_details}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>2. Have you been convicted of, or entered a plea of guilty or no contest to, or a criminal offense of possession of and or of drugs use?:</Label>
                    <span className='font-light text-sm'>{data?.offence_convictions?.drug_related_offence}, {data?.offence_convictions?.drug_related_offence_details}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>3. Have you ever had a teaching license revoked, suspended, invalidated, cancelled or denied by any teaching council or any authority; surrendered such a license or the right to apply for such a license; or had any other adverse action taken against such a license. Please note that this includes a reprimand, warning, or reproval and any order denying the right to apply or reapply for a license?:</Label>
                    <span className='font-light text-sm'>{data?.offence_convictions?.license_flag}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>4. Are you currently the subject of any review, inquiry, investigation, or appeal of alleged misconduct that could warrant discipline or termination by your employer. Please note that this includes any open investigation by or pending proceeding with a child protection agency and any pending criminal charges?:</Label>
                    <span className='font-light text-sm'>{data?.offence_convictions?.misconduct_flag}</span>
                </div>
            </div>
        </div>
    );
}