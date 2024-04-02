import { FaFilePdf } from "react-icons/fa";
import { Label } from '@/components/ui/label';
export const Attachments: React.FC = () => {
    return(
        <div className='h-full w-full'>
            <div className='grid md:grid-cols-2 m-10 gap-y-5 gap-x-5'>
                <div className='space-y-2'>
                    <Label>Certified copy of OMANG or passport</Label>
                    <div className='flex space-x-1'>
                        <FaFilePdf style={{ fontSize: '2rem', color: '#FF6666' }}/>
                        <span>Omang.pdf</span>
                    </div>
                    <span className='text-xs font-thin italic'>
                        click to open in a new tab.{" "}
                    </span>
                </div>
                <div className='space-y-2'>
                    <Label>Verification of qualification from BQA</Label>
                    <div className='flex space-x-1'>
                        <FaFilePdf style={{ fontSize: '2rem', color: '#FF6666' }}/>
                        <span>Omang.pdf</span>
                    </div>
                    <span className='text-xs font-thin italic'>
                        click to open in a new tab.{" "}
                    </span>
                </div>
            </div>
        </div>
    );
}