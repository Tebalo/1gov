import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Admin } from "./components/admin-login";
// import { version } from "./lib/store";

export default function Welcome() {
  return (
    <main 
      className="min-h-screen flex flex-col relative"
    >
      {/* Background Image Container */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={'/admin/background.svg'}
          alt=""
          fill
          className="object-cover"
          quality={100}
          priority
        />
        {/* Overlay for better readability */}
        <div className="absolute inset-0 bg-sky-400/55"/>
      </div>

      {/* Main Content */}
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

      {/* Footer */}
      <footer className="relative z-10 mt-auto">
        <div className="flex flex-col items-center mb-4">
          {/* <Button variant="secondary" className="mb-2" asChild>
            <Link href="/development" target="_blank" rel="noopener noreferrer">
              Get In Touch
            </Link>
          </Button> */}
          <p className="text-sm text-white">©2025 TRLS Portal</p>
        </div>
      </footer>
    </main>
  );
}