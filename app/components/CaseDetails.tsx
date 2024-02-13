import { DepartmentInfoCard } from './DepartmentInfoCard';
import { ProfileInfo } from './ProfileInfoCard';

export const CaseDetails = () => {
    return(
        <div className="p-2 w-96">
            <DepartmentInfoCard/>
            <ProfileInfo/>
        </div>
    );
}

