import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Appbar from "@/app/components/appbar";
import { AuthProvider } from "@/context/AuthContext";
import { ActivityTracker } from "@/components/ActivityTracker";
import { RefreshTokenModal } from "@/components/RefreshTokenModal";


const inter = Inter({ subsets: ["latin"] });

export default function DashboardLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return(
      <AuthProvider>
        {/* Monitor user activity */}
        <ActivityTracker />
        {/* Show refresh token modal when needed */}
        <RefreshTokenModal />
        <section className="bg-white">
            <div className="w-full">
              {children}   
            </div>
        </section>
    </AuthProvider>
    );
}
