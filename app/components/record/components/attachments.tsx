import { FaFilePdf } from "react-icons/fa";
import { Label } from '@/components/ui/label';
import Props from './types';
import Link from 'next/link';
import { cmsUrl } from '@/app/lib/store';

export const Attachments: React.FC<Props> = (data: Props) => {
    const path = `${cmsUrl}`
    return(
        <div className='h-full w-full'>
            <div className='grid md:grid-cols-2 gap-y-5 gap-x-5'>
                <div className='space-y-2'>
                    <Label>Certified copy of OMANG or passport</Label>
                    <div className='flex space-x-1'>
                        {/* <FaFilePdf style={{ fontSize: '2rem', color: '#FF6666' }}/>
                        <span>Omang.pdf</span> */}
                        <Link
                            href={path+data?.attachments?.national_id}
                            target='_self'
                            rel="noreferrer noopener"
                            className='cursor-pointer'
                            >
                                <div className='flex space-x-1'>
                                <FaFilePdf style={{ fontSize: '1.5rem', color: '#FF6666' }} />
                                <span>{data?.attachments?.national_id_copy}.pdf</span>
                                {/* <span>{qual.attachments}</span> */}
                                </div>
                        </Link>
                    </div>
                    <span className='text-xs font-thin italic'>
                        click to open in a new tab.{" "}
                    </span>
                </div>
                <div className='space-y-2'>
                    <Label>Verification of qualification from BQA</Label>
                    <div className='flex space-x-1'>
                        {/* <FaFilePdf style={{ fontSize: '2rem', color: '#FF6666' }}/>
                        <span>doc.pdf</span> */}
                    <Link
                        href={path+data?.attachments?.qualification_copy}
                        target='_self'
                        rel="noreferrer noopener"
                        className='cursor-pointer'
                        >
                            <div className='flex space-x-1'>
                            <FaFilePdf style={{ fontSize: '1.5rem', color: '#FF6666' }} />
                            <span>{data?.attachments?.qualification_copy}.pdf</span>
                            {/* <span>{qual.attachments}</span> */}
                            </div>
                    </Link>
                    </div>
                    <span className='text-xs font-thin italic'>
                        click to open in a new tab.{" "}
                    </span>
                </div>
            </div>
        </div>
    );
}