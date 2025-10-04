"use client"
import Form from "@/app/components/form";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function TeacherApplicationPage() {
  return (
    <ScrollArea className="">
      <section className='p-2 md:space-y-6'>

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
      </section>
    </ScrollArea>
  );
}