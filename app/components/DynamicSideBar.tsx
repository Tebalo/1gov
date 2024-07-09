import React from 'react';
import { Logo } from "./Logo";
import { getAccessGroups, getRole, getSession } from "../auth/auth";
import SidebarNav from "./SidebarNav";
import NavUtils from "./NavComponents/NavUtilis";
import { AccessGroup, Session, UserRole } from '../lib/types';
import { access } from 'fs';


interface SidebarProps {
  // Add any props if needed
}

const DynamicSidebar: React.FC<SidebarProps> = async () => {
  let session: Session | null = null;
  let userRole: string | '' = '';
  let access_profile: AccessGroup | null = null;

  try {
    //session = await getSession();
    userRole = await getRole() || '';
    access_profile = await getAccessGroups() || null;
  } catch (error) {
    console.error('Error fetching session or role:', error);
    // Handle error appropriately, maybe show an error message or redirect
  }

  return (
    <aside 
      id="dynamic-sidebar" 
      className="top-0 left-0 lg:w-52 shadow-xl transition-transform -translate-x-full sm:translate-x-0 hidden md:block" 
      aria-label="Sidebar"
    >
      <div className="h-screen px-0 bg-sky-400 shadow-lg rounded-r-lg">
        <div className="md:rounded-r-lg rounded-b-lg bg-white lg:p-5 md:p-1 lg:w-48 md:w-36">
          <Logo
            width={350}
            height={350}
          />
        </div>
        <div className="my-10 ml-5">
          <SidebarNav currentPersona={access_profile?.current || ''} />
        </div>
        <div className="absolute bottom-0 w-full border-t bg-sky-400">
          <NavUtils accessProfile={access_profile} />
        </div>
      </div>
    </aside>
  );
}

export default DynamicSidebar;