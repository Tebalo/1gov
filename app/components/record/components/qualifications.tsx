import { Label } from '@/components/ui/label';
import Props from './types';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import {
HoverCard,
HoverCardContent,
HoverCardTrigger,
} from "@/components/ui/hover-card"
import { ChevronRightIcon } from "@radix-ui/react-icons"
import { apiUrl } from '@/app/lib/store';
import { FaFilePdf } from "react-icons/fa";
import Link from 'next/link';
import { Button } from "@/components/ui/button"

export const Qualifications: React.FC<Props> = (data: Props) => {
    const path = `${apiUrl}/Qualifications/`
    return (
        <div className=''>
            <Table>
                <TableCaption>A list of qualifications.</TableCaption>
                <TableHeader>
                    <TableRow>
                    <TableHead className="w-[100px]">Level</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Awarding Institution</TableHead>
                    <TableHead>Attachment</TableHead>
                    <TableHead className="text-right">Year of completion</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.edu_pro_qualifications.map((qual, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">{qual?.level}</TableCell>
                                <TableCell>{qual?.qualification}</TableCell>
                                <TableCell>{qual?.institution}</TableCell>
                                <TableCell>
                                    <Link
                                    href={path+qual.attachments}
                                    target='_blank'
                                    rel="noreferrer noopener"
                                    className='cursor-pointer'
                                    >
                                        <div className='flex space-x-1'>
                                        <FaFilePdf style={{ fontSize: '1.5rem', color: '#FF6666' }} />
                                        <span>doc.pdf</span>
                                        {/* <span>{qual.attachments}</span> */}
                                        </div>
                                    </Link>
                                </TableCell>
                                <TableCell className="text-center">{qual?.qualification_year}</TableCell>
                                <HoverCard>
                                    <HoverCardTrigger>
                                        <Button variant='outline'>
                                            Subjects
                                            <ChevronRightIcon className="h-4 w-4" />
                                        </Button>
                                    </HoverCardTrigger>
                                    <HoverCardContent>
                                    <div>
                                        <Label>Minor subjects</Label>
                                        <ol type='1'>
                                            {qual.minor_subjects.map((subject, index) => (
                                            <li key={index}>
                                                <span className='font-light mr-2'>{index+1}.</span>
                                                <span className='font-light text-sm'>{subject}</span>
                                            </li>
                                            ))}
                                        </ol>
                                    </div>
                                    <div>
                                        <Label>Major subjects</Label>
                                        <ol type='1'>
                                            {qual.major_subjects.map((subject, index) => (
                                            <li key={index}>
                                                <span className='font-light mr-2'>{index+1}.</span>
                                                <span className='font-light text-sm'>{subject}</span>
                                            </li>
                                            ))}
                                        </ol>
                                    </div>
                                    </HoverCardContent>
                                </HoverCard>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    {/* <TableRow>
                    <TableCell colSpan={3}>Total</TableCell>
                    <TableCell className="text-right">$2,500.00</TableCell>
                    </TableRow> */}
                </TableFooter>
            </Table>
        </div>
      );
}