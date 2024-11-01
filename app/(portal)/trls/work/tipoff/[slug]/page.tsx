import React from 'react';
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Info, FileCheck } from "lucide-react"
import { data } from '@/app/lib/types';
import { getRole } from "@/app/auth/auth";
import { getTipOffById } from "@/app/lib/actions";
import Link from "next/link";
import { RefreshCw } from "lucide-react";

interface TipOffViewerProps {
  data: data;
}
export default async function Page({ params }: { params: { slug: string } }) {
  const id = params.slug;
  let tipoff;
  let error = null;

  try {
    const response = await getTipOffById(id);
    tipoff = response.data;
    const userRole = await getRole();
    
    return (
      <main className="h-full">
        <div className="flex flex-row h-full gap-0">
          {tipoff ? (
            <>{userRole && <TipOffViewer data={tipoff} />}</>
          ) : (
            <div className="flex h-[80vh] items-center justify-center w-full">
              <div className="text-center px-4">
                <div className="mb-6 flex justify-center">
                  <RefreshCw className="h-16 w-16 text-gray-400" />
                </div>
                <h2 className="mb-4 text-3xl font-semibold text-gray-900">
                  Connection error
                </h2>
                <p className="mb-8 text-gray-600">
                  Unable to load the tip-off record. Please check your connection and try again
                </p>
                <Link
                  href={`/trls/work/tipoff/${id}`}
                  scroll={false}
                  className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Retry
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    );
  } catch (e) {
    return (
      <main className="h-full">
        <div className="flex h-[80vh] items-center justify-center w-full">
          <div className="text-center px-4">
            <div className="mb-6 flex justify-center">
              <RefreshCw className="h-16 w-16 text-gray-400" />
            </div>
            <h2 className="mb-4 text-3xl font-semibold text-gray-900">
              Connection error
            </h2>
            <p className="mb-8 text-gray-600">
              Unable to load the tip-off record. Please check your connection and try again
            </p>
            <Link
              href={`/trls/work/tipoff/${id}`}
              scroll={false}
              className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </Link>
          </div>
        </div>
      </main>
    );
  }
}

// Make sure to place this file at app/tipoffs/[slug]/page.tsx

const TipOffViewer: React.FC<TipOffViewerProps> = ({ data }) => {
  return (
    <ScrollArea className="h-full w-full">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Tip-off Details
          </h1>
          <p className="text-gray-500 mt-2">
            Tip-off Number: {data.tipoff_number}
          </p>
          <div className="mt-2 h-1 w-full bg-blue-400 rounded-full"></div>
        </div>

        <div className="grid gap-6">
          {/* Personal Information */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-6 h-6 text-blue-500"/>
              <h2 className="text-xl font-semibold">Personal Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Full Name</label>
                <p className="mt-1 text-gray-900">{data.full_name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Phone Number</label>
                <p className="mt-1 text-gray-900">{data.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Identity Number</label>
                <p className="mt-1 text-gray-900">{data.identity_No}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Email</label>
                <p className="mt-1 text-gray-900">{data.email}</p>
              </div>
            </div>
          </Card>

          {/* Crime Information */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileCheck className="w-6 h-6 text-blue-500"/>
              <h2 className="text-xl font-semibold">Crime Information</h2>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Nature of Crime</label>
                <p className="mt-1 text-gray-900">{data.nature_of_crime}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Crime Location</label>
                <p className="mt-1 text-gray-900">{data.crime_location}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Description</label>
                <p className="mt-1 text-gray-900 whitespace-pre-wrap">{data.description}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </ScrollArea>
  );
};
