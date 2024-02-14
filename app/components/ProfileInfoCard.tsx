import { ProfileItems } from './ProfileItems';
import { InformationCard } from './InformationCard';

export const ProfileInfo = () => {
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
                <ProfileItems Label="First Name" Value="Michael"/>
                <ProfileItems Label="Middle Name" Value="Doe"/>
                <ProfileItems Label="Last Name" Value="Michael"/>
                <ProfileItems Label="Primary Email Address" Value="michael@gmail.com"/>
                <ProfileItems Label="Primary Phone Number" Value="+2677000000"/>
            </div>
        </div>
    );
}