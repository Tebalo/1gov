import { ProfileItems } from './ProfileItems';
import { InformationCard } from './InformationCard';
import {users} from '../lib/store';



export const ProfileInfo = () => {
    const user = users[0];
    return(
        <div className="bg-white rounded-lg shadow-lg">
            <div className="p-2 mx-1">
                <div>
                    <span className="text-gray-900 font-semibold">Profile Information</span>
                </div>
                <div className="flex items-center mb-1">
                    <span className="text-gray-900 text-xs text-wrap">The following information will be submitted along with your application.</span>
                </div>
                <InformationCard Information='Go to your profile page and add any missing information to your profile before proceeding with this application.'/>
            </div>
            <div className="mx-2 flex flex-wrap">    
                <ProfileItems Label="First Name" Value={user.forenames}/>
                <ProfileItems Label="Middle Name" Value={user.middlename}/>
                <ProfileItems Label="Last Name" Value={user.surname}/>
                <ProfileItems Label="Primary Email Address" Value={user.email}/>
                <ProfileItems Label="Primary Phone Number" Value={user.mobile}/>
            </div>
        </div>
    );
}