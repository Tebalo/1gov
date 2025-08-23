import Image from 'next/image'
import { RegistrationForm } from '../components/registration-form'

export default function UserRegistrationPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-6 p-6 md:p-10 lg:p-12">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex items-center gap-2 font-medium">
            <div className="w-6 h-6 items-center justify-center">
              <Image
                src="/botepco.png"
                alt='Coat-of-arms'
                width={24}
                height={24}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            Botepco BW.
          </a>
        </div>
        
        <div className="flex flex-1 items-start justify-center pt-8 lg:pt-12">
          <div className="w-full max-w-2xl">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
                Create your account
              </h1>
              <p className="text-muted-foreground mt-4 text-lg">
                Join Botepco to access teacher registration and licensing services
              </p>
            </div>
            
            <div className="mb-8">
              <RegistrationForm />
            </div>
            
            <div className="text-center text-sm">
              <p className="text-muted-foreground">
                Already have an account?{" "}
                <a 
                  href="/login" 
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center">
          <p className="text-xs text-muted-foreground text-center max-w-md">
            By creating an account, you agree to our terms of service and privacy policy. 
            Your information is securely protected and will only be used for registration purposes.
          </p>
        </div>
      </div>
      
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/certified-teachers.jpg"
          alt="Botepco Leadership Team"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-background/20" />
        <div className="absolute bottom-8 left-8 right-8">
          <blockquote className="text-white">
            <p className="text-xl font-medium leading-relaxed">
              &#34;Empowering educators through streamlined registration and professional development opportunities&#34;
            </p>
            <footer className="mt-4 text-sm opacity-80">
              — Botepco Teacher Registration & Licensing Services
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  )
}