//"use client"
import Link from "next/link";
import { Logo } from "./Logo";

import { getSession, logout } from "../auth/auth";
import SidebarNav from "./SidebarNav";
import NavUtils from "./NavComponents/NavUtilis";

const DynamicSidebar: React.FC = async ({}) => {
    const session = await getSession();
    const userRole = session?.user?.roles[0] 

    return (
        <aside id="dynamic-sidebar" className=" top-0 left-0 lg:w-52 shadow-xl transition-transform -translate-x-full sm:translate-x-0 hidden md:block" aria-label="Sidebar">
            <div className="h-screen px-0 bg-sky-400 shadow-lg rounded-r-lg">
                <div className="md:rounded-r-lg rounded-b-lg bg-white lg:p-5 md:p-1 lg:w-48 md:w-36">
                    <Logo
                    width={350}
                    height={350}
                    />
                </div>
                <div className="my-10 ml-5">
                    <SidebarNav userRole={userRole}                    
                    />
                </div>
                <div className="absolute bottom-0 w-full border-t bg-sky-400">
                        <NavUtils userRole={userRole}   />
{/*                    <button 
                        type="button" 
                        id="dropDownButton"
                        className="flex items-center w-full p-2 text-base text-gray-100 transition duration-75 rounded-lg group" 
                        aria-controls="dropdown-example" 
                        data-dropdown-toggle="doubleDropdown"
                        onClick={toggleProfile}
                    >
                        <div className="flex lg:justify-start justify-center md:w-full">
                            <div className=""><FaRegistered style={{ fontSize: '1.5rem', color: '#FFFFFF' }}/></div> 
                            <div><span className="flex-1 hidden lg:block ms-3 text-left rtl:text-right lg:text-base font-medium whitespace-nowrap">John Doe</span></div>
                        </div>
                    </button>
                    <div className={`md:absolute top-full text-sm border -mt-40 -mr-60 right-0 ${isDropdownOpen ? '' : 'hidden'} z-50 bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-60`}>
                        <ul id="dropdown-example" aria-labelledby="dropDownButton">
                            <Link
                            href="/portal/dashboard/home"
                            onClick={()=> handleChangePortal('customer')}
                            className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100"
                            >
                                <span>Customer Portal</span>
                            </Link>
                            <Link
                            href="/portal/dashboard/home-o"
                            onClick={()=> handleChangePortal('registrationOfficer')}
                            className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100"
                            >
                                <span>Registration Officer Portal</span>
                            </Link>
                            <Link
                            href="/portal/dashboard/home-o"
                            onClick={()=> handleChangePortal('registrationOfficer')}
                            className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100"
                            >
                                <span>##### Officer Portal</span>
                            </Link>
                            <Link
                            href="/portal/dashboard/home-a"
                            onClick={()=> handleChangePortal('admin')}
                            className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100"
                            >
                                <span>Admin Portal</span>
                            </Link>

                        </ul>
                    </div>*/}

{/*                    <div className={`md:absolute top-full text-sm border -mt-40 -mr-60 right-0 ${isProfileOpen ? '' : 'hidden'} z-50 bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-60`}>
                        <ul id="dropdown-example" aria-labelledby="dropDownButton">

                            <Link
                            href="/portal/dashboard/home-o"
                            onClick={()=> handleChangePortal('registrationOfficer')}
                            className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100"
                            >
                                <span>Profile</span>
                            </Link>
                            <Link
                            href="/portal/dashboard/home-o"
                            onClick={()=> handleChangePortal('registrationOfficer')}
                            className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100"
                            >
                                <span>Preferences</span>
                            </Link>
                            <Link
                            href="/portal/dashboard/home-o"
                            onClick={()=> handleChangePortal('registrationOfficer')}
                            className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100"
                            >
                                <span>About this app</span>
                            </Link>
                            <Link
                            href="/welcome"
                            onClick={()=> handleChangePortal('admin')}
                            className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100"
                            >
                                <span>Logout</span>
                            </Link>
                        </ul>
                    </div>*/}
                </div>
            </div>
        </aside>
    );
}

export default DynamicSidebar;