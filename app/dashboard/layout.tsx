import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Sidebar from "../components/sidebar";


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
    <section className="bg-white">
        <Sidebar/>
        {children}    
    </section>
    );
}
