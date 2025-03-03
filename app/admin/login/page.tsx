import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Admin } from "./components/admin-login";
// import { version } from "./lib/store";

export default function Welcome() {
  return (
      <div className="relative z-10 flex-grow flex items-center justify-center px-4">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="space-y-1 flex flex-col items-center">
            <div className="w-32 h-32 mb-2 relative">
              <Image 
                src="/Code-of-Arms-colour.png"
                alt='Logo'
                fill
                className="object-contain"
              />
            </div>
            <CardTitle className="text-2xl font-bold">Welcome to TRLS</CardTitle>
            <CardTitle className="text-xl text-red-500">ADMIN Portal</CardTitle>
            <CardDescription>
              Complete the form below to access your account
            </CardDescription>
            <Separator className="mt-2"/>
          </CardHeader>
          <CardContent>
            <Admin />
          </CardContent>
        </Card>
      </div>
  );
}