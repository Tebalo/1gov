import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Appbar from "@/app/components/appbar";
import Sidebar from "@/app/components/sidebar";
import { FaBeer, FaHome, FaCube, FaUser, FaCogs} from "react-icons/fa";
import { usePathname } from "next/navigation";
import DynamicSidebar from "@/app/components/DynamicSideBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard",
};

interface SideBarItem {
  path: string;
  icon: JSX.Element;
  title: string;
}

const customerPortalSItems: SideBarItem[] = [
  { path: '/dashboard/home', icon: <FaHome style={{ fontSize: '2rem', color: '#FFFFFF' }} />, title: 'Home' },
  { path: '/dashboard/my-applications', icon: <FaCube style={{ fontSize: '2rem', color: '#FFFFFF' }} />, title: 'My Applications' },
  { path: '/dashboard/profile', icon: <FaUser style={{ fontSize: '2rem', color: '#FFFFFF' }} />, title: 'Profile' },
  { path: '/dashboard/settings', icon: <FaCogs style={{ fontSize: '2rem', color: '#FFFFFF' }} />, title: 'Settings' },
]

export default function DashboardLayout({
    children,
  }: {
    children: React.ReactNode
  }) {

    return(
    <section className="bg-white flex">
        <DynamicSidebar/>
        <div className="w-full">
          <Appbar/>
          {children}   
        </div>
    </section>
    );
}
