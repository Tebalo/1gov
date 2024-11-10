import { 
  Info, FileText, FileCheck, User, Calendar, FileType
} from 'lucide-react'
import dynamic from 'next/dynamic'
import { Activity } from '@/app/lib/types'

const InfoCard = dynamic(() => import('../InfoCard'), { ssr: false })
const InfoItem = dynamic(() => import('../InfoItem'), { ssr: false })

interface ActivityViewProps {
  data: Activity;
}

const ActivityView: React.FC<ActivityViewProps> = ({ data }) => {
  return (
    <div className="container mx-auto px-4 py-8 h-screen flex flex-col">
      <div className="mb-4 flex-shrink-0 shadow-md">
        <div className='flex justify-between'>
          <h1 className="text-3xl font-bold text-gray-800">
            Activity Information
          </h1>
        </div>
        <div className="mt-2 h-1 w-full bg-blue-400 rounded-full"></div>
      </div>
      
      <div className='flex-grow overflow-y-auto'>
        <div className='space-y-8 pr-4'>
          <InfoCard title='Activity Details' icon={<FileText className="w-6 h-6 text-blue-500"/>}>
            <InfoItem label="Activity Number" value={data.activity_number}/>
            <InfoItem label="Activities" value={data.activities}/>
            <InfoItem label="Action Taken" value={data.action_taken || 'N/A'}/>
          </InfoCard>

          <InfoCard title='User Information' icon={<User className="w-6 h-6 text-blue-500"/>}>
            <InfoItem label="Full Name" value={data.full_name}/>
            <InfoItem label="Role" value={data.role}/>
            <InfoItem label="User ID" value={data.userid}/>
            {/* <InfoItem label="Anonymous" value={data.anonymous}/> */}
            <InfoItem label="Submission Type" value={data.submission_type}/>
          </InfoCard>

          <InfoCard title='Record Information' icon={<FileType className="w-6 h-6 text-blue-500"/>}>
            <InfoItem label="Record Type" value={data.record_type}/>
            <InfoItem label="Record ID" value={data.record_id}/>
          </InfoCard>

          <InfoCard title='Timestamps' icon={<Calendar className="w-6 h-6 text-blue-500"/>}>
            <InfoItem label="Created At" value={new Date(data.created_at).toLocaleString()}/>
            <InfoItem label="Updated At" value={new Date(data.updated_at).toLocaleString()}/>
          </InfoCard>
        </div>
      </div>
    </div>
  );
};

export default ActivityView;