import Form from "@/app/components/form";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function TeacherApplicationPage() {
  return (
    <ScrollArea className="h-[calc(100vh-2rem)]">
      <section className='p-2 space-y-6'>
        {/* Page Header */}
        {/* <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Teacher Registration System</h1>
          <p className="text-gray-600">Complete your professional registration and licensing application</p>
        </div> */}

        {/* Main Form Container */}
        <div className='relative'>
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white/30 to-indigo-50/50 rounded-3xl transform rotate-1"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white/30 to-blue-50/50 rounded-3xl transform -rotate-1"></div>
          
          {/* Form content */}
          <div className="relative z-10">
            <Form />
          </div>
        </div>

        {/* Development Studio Section (Optional) */}
        {/* Uncomment if you want to show development tools */}
        {/* <DevelopmentStudio /> */}
      </section>
    </ScrollArea>
  );
}