import { DepartmentInfoCard } from './DepartmentInfoCard';
import { ProfileInfo } from './ProfileInfoCard';

export const CaseDetails = () => {
    return(
        <div className="p-2 w-1/3 hidden lg:block">
            <DepartmentInfoCard/>
            <ProfileInfo/>
        </div>
    );
}

