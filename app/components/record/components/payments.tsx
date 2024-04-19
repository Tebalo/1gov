import { Label } from '@/components/ui/label';
import Props from './types';

export const Payment: React.FC<Props> = (pre: Props) => {
    return(
        <div className='h-full w-full'>
            <div className='grid md:grid-cols-2 gap-y-5'>
                <div className='flex flex-col space-y-1'>
                    <Label>Payment name:</Label>
                    <span className='font-light text-sm'>Application For Teacher registration</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Amount:</Label>
                    <span className='font-light text-sm'>P 100.00</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Status:</Label>
                    <span className='font-light text-sm'>SUCCESSFUL</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Payment Ref:</Label>
                    <span className='font-light text-sm'>PPM-1668102843</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Service code:</Label>
                    <span className='font-light text-sm'>MLHA_004_01_001</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Application Ref:</Label>
                    <span className='font-light text-sm'>b2dad640-611f-11ed-b534-7fdc9999316f</span>
                </div>
            </div>
        </div>
    );
}