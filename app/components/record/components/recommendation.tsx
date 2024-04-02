import { Label } from '@/components/ui/label';
import Props from './types';
import { FaFilePdf } from 'react-icons/fa';
import Link from 'next/link';
const Recommendation: React.FC<Props> = (data: Props) => {
    return(
        <div className='h-full w-full'>
            <div className='grid md:grid-cols-3 mx-10 mt-10 mb-2 gap-y-5'>
                <div className='flex flex-col space-y-1'>
                    <Label>Recommended:</Label>
                    <span className='font-light text-sm'>{data.recommendation.recommended}</span>
                </div>
                <div className=''>
                    <Link
                        href={data.recommendation.attachment}
                        target='_blank'
                        rel="noreferrer noopener"
                        className='cursor-pointer'
                        >
                            <div className='flex space-x-1'>
                                <FaFilePdf style={{ fontSize: '1.5rem', color: '#FF6666' }}/>
                                <span>document.pdf</span>
                            </div>
                            <span className='text-xs font-thin italic'>
                               click to open in a new tab.{" "}
                            </span>
                    </Link>
                </div>
            </div>
        </div>
    );
}