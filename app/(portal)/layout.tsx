import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Appbar from "@/app/components/appbar";


const inter = Inter({ subsets: ["latin"] });

export default function DashboardLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return(
    <section className="bg-white">
        <div className="w-full">
          {children}   
        </div>
    </section>
    );
}
