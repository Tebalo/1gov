import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Sidebar from "../components/sidebar";
import Appbar from "../components/appbar";


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
    <section className="bg-white flex">
        <Sidebar/>
        <div className="w-full border-gray-800">
          <Appbar/>
          {children}   
        </div>
    </section>
    );
}
