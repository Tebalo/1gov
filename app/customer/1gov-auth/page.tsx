"use client";
import Image from 'next/image';
import { LoginForm } from '../components/login-form';
import { OneGovAuth } from '../components/1gov-login';

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex items-center gap-2 font-medium">
            {/* <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div> */}
            <div className="w-6 h-6 items-center justify-center">
              <Image
                src="/botepco.png"
                alt='Coat-of-arms'
                width={100}
                height={100}
                className="w-full h-full object-contain"
                priority
                />
            </div>
            Botepco BW.
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs space-y-6">
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Login to your account</h1>
                <p className="text-muted-foreground text-sm text-balance">
                Enter your <b className='text-bold'>1GOV</b>ID below to login to your account
                </p>
            </div>
            <OneGovAuth />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src="/leadership.jpg"
          alt="Image"
          fill
          className="object-cover dark:brightness-[0.2] dark:grayscale"
          priority
        />
      </div>
    </div>
  )
}
