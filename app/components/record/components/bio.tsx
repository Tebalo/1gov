import { Label } from '@/components/ui/label';
import Props from './types';
export const Bio: React.FC<Props> = (data: Props) => {
    return(
        <div className='h-full w-full'>
            <div className='grid md:grid-cols-4 m-10 gap-y-5'>
                {/* <div className='flex flex-col space-y-1'>
                    <Label>National ID:</Label>
                    <span className='font-light text-sm'>{bio?.id}</span>
                </div> */}
                <div className='flex flex-col space-y-1'>
                    <Label>Forenames:</Label>
                    <span className='font-light text-sm'>{data?.bio_datas?.forenames}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Surname:</Label>
                    <span className='font-light text-sm'>{data?.bio_datas?.surname}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Date of birth:</Label>
                    <span className='font-light text-sm'>{data?.bio_datas?.dob}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Place of birth:</Label>
                    <span className='font-light text-sm'>{data?.bio_datas?.pob}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Gender:</Label>
                    <span className='font-light text-sm'>{data?.bio_datas?.gender}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Nationality:</Label>
                    <span className='font-light text-sm'>{data?.bio_datas?.nationality}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Postal address:</Label>
                    <span className='font-light text-sm'>{data?.bio_datas?.postalAddress}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Physical address:</Label>
                    <span className='font-light text-sm'>{data?.bio_datas?.physicalAddress}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Email:</Label>
                    <span className='font-light text-sm'>{data?.bio_datas?.email}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Mobile:</Label>
                    <span className='font-light text-sm'>{data?.bio_datas?.mobile}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Marital status:</Label>
                    <span className='font-light text-sm'>{data?.bio_datas?.maritalStatus}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Next of kin name:</Label>
                    <span className='font-light text-sm'>{data?.bio_datas?.nextOfKinName}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Next of kin relation:</Label>
                    <span className='font-light text-sm'>{data?.bio_datas?.nextOfKinRelation}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Next of kin contact:</Label>
                    <span className='font-light text-sm'>{data?.bio_datas?.nextOfKinContact}</span>
                </div>
            </div>
        </div>
    );
}