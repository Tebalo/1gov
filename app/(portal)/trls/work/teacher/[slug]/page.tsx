import { getRole } from "@/app/auth/auth";
import {  getTeacherRegistrationById } from "@/app/lib/actions";
import Link from "next/link";
import TeacherRegistrationViewer from "../ui/teacher-section";
import { Role } from "@/app/lib/store";
import { RefreshCw } from "lucide-react";

export default async function Page({ params }: { params: { slug: string } }) {
  const id = params.slug;
  let response;
  let error = null;

  try {
    response = await getTeacherRegistrationById(id);
    const rawRole = await getRole() as Role; // type assertion
    const userRole = rawRole.toLowerCase() as Lowercase<Role>;

    return (
      <main className="h-full">
        <div className="flex flex-row h-full gap-0">
          {response.code==200 ? (
            <>{userRole && <TeacherRegistrationViewer data={response} userRole={userRole}/>}</>
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
                  Unable to load the record. Please check your connection and try again
                </p>
                <Link
                  href={`/trls/work/teacher/${id}`}
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
              Unable to load the record. Please check your connection and try again
            </p>
            <Link
              href={`/trls/changeofcategory/${id}`}
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