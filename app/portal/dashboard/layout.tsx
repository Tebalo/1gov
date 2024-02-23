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

export default function DashboardLayout({
    children,
  }: {
    children: React.ReactNode
  }) {

    return(
    <div className="flex h-screen bg-slate-100">
        <div>
          <DynamicSidebar/>
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          {/*<Appbar/>*/}
          <main className="p-4 rounded-lg overflow-y-auto">
            <div className="p-0">
              {children}   
            </div>
          </main>
        </div>
    </div>
    );
}
