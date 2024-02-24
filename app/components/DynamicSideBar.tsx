"use client"
import React,{useState, useEffect, Suspense} from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { FaHome, FaHubspot, FaComments, FaUser, FaCogs, FaCog, FaUsers, FaUsersCog, FaLayerGroup, FaRegChartBar, FaChevronRight} from "react-icons/fa";
import { usePathname } from "next/navigation";

interface SideBarItem {
    path: string;
    icon: JSX.Element;
    title: string;
}

const customerPortalSItems: SideBarItem[] = [
    { path: '/portal/dashboard/home', icon: <FaHome style={{ fontSize: '2rem', color: '#FFFFFF' }} />, title: 'Home' },
    { path: '/portal/dashboard/my-applications', icon: <FaLayerGroup style={{ fontSize: '2rem', color: '#FFFFFF' }} />, title: 'My Applications' },
    { path: '/portal/dashboard/profile', icon: <FaUser style={{ fontSize: '2rem', color: '#FFFFFF' }} />, title: 'Profile' },
    { path: '/portal/dashboard/spaces', icon: <FaComments style={{ fontSize: '2rem', color: '#FFFFFF' }} />, title: 'Spaces' },
    { path: '/portal/dashboard/settings', icon: <FaCog style={{ fontSize: '2rem', color: '#FFFFFF' }} />, title: 'Settings' },
]

const generalPortalSItems: SideBarItem[] = [
    { path: '/portal/dashboard/profile', icon: <FaUser style={{ fontSize: '2rem', color: '#FFFFFF' }} />, title: 'Profile' },
    { path: '/portal/dashboard/settings', icon: <FaCog style={{ fontSize: '2rem', color: '#FFFFFF' }} />, title: 'Settings' },
]

const registrationOfficerPortalSItems: SideBarItem[] = [
    { path: '/portal/dashboard/home-o', icon: <FaHome style={{ fontSize: '2rem', color: '#FFFFFF' }} />, title: 'Home' },
    { path: '/portal/dashboard/teams', icon: <FaUsers style={{ fontSize: '2rem', color: '#FFFFFF' }} />, title: 'Teams' },
    { path: '/portal/dashboard/profile', icon: <FaUser style={{ fontSize: '2rem', color: '#FFFFFF' }} />, title: 'Profile' },
    { path: '/portal/dashboard/spaces', icon: <FaComments style={{ fontSize: '2rem', color: '#FFFFFF' }} />, title: 'Spaces' },
    { path: '/portal/dashboard/settings', icon: <FaCogs style={{ fontSize: '2rem', color: '#FFFFFF' }} />, title: 'Settings' },
]
const adminPortalSItems: SideBarItem[] = [
    { path: '/portal/dashboard/home-a', icon: <FaHome style={{ fontSize: '2rem', color: '#FFFFFF' }} />, title: 'Home' },
    { path: '/portal/dashboard/teams', icon: <FaUsers style={{ fontSize: '2rem', color: '#FFFFFF' }} />, title: 'Teams' },
    { path: '/portal/dashboard/reports', icon: <FaRegChartBar style={{ fontSize: '2rem', color: '#FFFFFF' }} />, title: 'Reports'},
    { path: '/portal/dashboard/users', icon: <FaUsersCog style={{ fontSize: '2rem', color: '#FFFFFF' }} />, title: 'Users' },
    { path: '/portal/dashboard/spaces', icon: <FaComments style={{ fontSize: '2rem', color: '#FFFFFF' }} />, title: 'Spaces' },
    { path: '/portal/dashboard/explore-data', icon: <FaHubspot style={{ fontSize: '2rem', color: '#FFFFFF' }} />, title: 'Explore Data' },
    { path: '/portal/dashboard/profile', icon: <FaUser style={{ fontSize: '2rem', color: '#FFFFFF' }} />, title: 'Profile' },
    { path: '/portal/dashboard/settings', icon: <FaCogs style={{ fontSize: '2rem', color: '#FFFFFF' }} />, title: 'Settings' },
]
const DynamicSidebar: React.FC = ({}) => {
    const currentPath = usePathname();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [currentPortal, setCurrentPortal] = useState(() => {
        // Initialize currentPortal with the value from localStorage if available, otherwise default to 'customer'
        if(typeof window !== 'undefined'){
            return localStorage.getItem("currentPortal" || "admin")
        }
        return "admin";
    });

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };
    const handleChangePortal = (value: string) => {
        setCurrentPortal(value)
        setIsDropdownOpen(false); // Close dropdown after selecting a portal
    }

    // UseEffect hook to force re-render when currentPortal changes
    useEffect(() =>{
        // This effect will trigger whenever currentPortal changes
        // You can add any additional logic here if needed
        // Update localStorage with currentPortal value whenever it changes
        if(currentPortal){ // Assert that currentPortal is not null(Solve typescript error)
            if(typeof window !== 'undefined'){
            localStorage.setItem("currentPortal", currentPortal);
            }else{
                // toast, fix
            }
        }
    }, [currentPortal]); 

    let sidebarItems: SideBarItem[] = [];

    // Determine which set of sidebar items to display based on the current portal
    switch (currentPortal){
        case 'customer':
            sidebarItems= customerPortalSItems;
            break;
        case 'registrationOfficer':
            sidebarItems = registrationOfficerPortalSItems;
            break;
        case 'admin':
            sidebarItems = adminPortalSItems;
            break;
        default:
            sidebarItems = customerPortalSItems;
            break
    }

    return (
        <aside id="dynamic-sidebar" className=" top-0 left-0 lg:w-60 shadow-xl transition-transform -translate-x-full sm:translate-x-0 hidden md:block" aria-label="Sidebar">
            <div className="h-screen px-0 bg-sky-400 shadow-lg rounded-r-lg">
                <div className="md:rounded-r-lg rounded-b-lg bg-white lg:p-5 md:p-1 lg:w-48 md:w-36">
                    <Logo
                    width={350}
                    height={350}
                    />
                </div>
                <div className="my-10 lg:ml-5 overflow-y-auto h-96 no-scrollbar scrollbar-hide">
                    <ul className="space-y-2 font-medium">
                        {sidebarItems.map((item) =>(
                            <li key={item.path} className="flex space-x-2">
                                <Suspense fallback={<span className="text-gray-100 lg:text-lg text-xs">Loading....</span>}>
                                <div className={`${currentPath === item.path ? 'bg-sky-200 w-2 md:h-18 lg:h-12 my-1 rounded-lg':''}`}></div>
                                <Link href={item.path} className={`lg:flex items-center w-full lg:px-2 py-2 rounded-lg justify-start space-x-2 ${currentPath === item.path ? 'bg-sky-300':'text-gray-100'}`}>
                                    <div className="flex justify-center">{item.icon}</div>
                                    <div className="flex justify-center"><span className="text-gray-100 lg:text-lg text-xs">{item.title}</span></div>
                                </Link>
                                </Suspense>
                            </li>
                        )
                        )}
                    </ul>          
                </div>
                <div className="absolute bottom-0 border-t w-full bg-sky-400">
                    <button 
                        type="button" 
                        id="dropDownButton"
                        className="flex items-center w-full p-2 text-base text-gray-100 transition duration-75 rounded-lg group" 
                        aria-controls="dropdown-example" 
                        data-dropdown-toggle="doubleDropdown"
                        onClick={toggleDropdown}
                    >
                        <div className="flex lg:ml-5 lg:justify-between">
                            <div className="hidden lg:block"><FaChevronRight style={{ fontSize: '1.5rem', color: '#FFFFFF' }}/></div> 
                            <div><span className="flex-1 ms-3 text-left rtl:text-right font-medium whitespace-nowrap">Switch Portal</span></div>
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
                    </div>
                </div>
            </div>
        </aside>
    );
}

export default DynamicSidebar;