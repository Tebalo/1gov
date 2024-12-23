import NavUtils from '@/app/components/NavComponents/NavUtilis';
import SidebarNav from '@/app/components/SidebarNav';
import React from 'react';
import MenuItems from './MenuItems';
// import { getAccessGroups, getRole} from "../auth/auth";
// import SidebarNav from "./SidebarNav";
// import NavUtils from "./NavComponents/NavUtilis";
// import { AccessGroup, Session } from '../lib/types';


interface SidebarProps {
  // Add any props if needed
}

const DevSidebar: React.FC<SidebarProps> = async () => {
//   let session: Session | null = null;
//   let userRole: string | '' = '';
//   let access_profile: AccessGroup | null = null;

//   try {
//     //session = await getSession();
//     userRole = await getRole() || '';
//     access_profile = await getAccessGroups() || null;
//     if(!access_profile){
//       //await logout()
//     }
//   } catch (error) {
//     console.error('Error fetching session or role:', error);
//     // Handle error appropriately, maybe show an error message or redirect
//   }

  return (
    <aside 
      id="dynamic-sidebar" 
      className="top-0 left-0 lg:w-48 shadow-xl transition-transform -translate-x-full sm:translate-x-0 hidden md:block" 
      aria-label="Sidebar"
    >
      <div className="h-screen px-0 bg-slate-800 shadow-lg rounded-r-sm">
      <div className="md:rounded-r-lg rounded-b-lg bg-white lg:p-4 md:p-1 lg:w-36 md:w-32 text-blue-800">Dev Studio</div>
        <div className="my-10 ml-0">
          <MenuItems currentPersona={'ADMIN'} />
        </div>
        {/* <div className="absolute bottom-0 w-full border-t border-slate-700 bg-slate-900">
          <NavUtils accessProfile={access_profile} />
        </div> */}
      </div>
    </aside>
  );
}

export default DevSidebar;