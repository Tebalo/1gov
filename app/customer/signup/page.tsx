import Image from "next/image";
import { RegistrationForm } from "../components/registration-form";

export default function UserRegistrationPage() {
  return (
<div className="grid min-h-svh lg:grid-cols-2">
  {/* Left Column — Registration Form */}
  <div className="flex flex-col gap-6 p-6 md:p-10 lg:p-12">
    {/* Logo + Brand */}
    <div className="flex justify-center gap-2 md:justify-start">
      <a href="/" className="flex items-center gap-2 font-medium">
        <div className="w-6 h-6 flex items-center justify-center">
          <Image
            src="/botepco.png"
            alt="Coat-of-arms"
            width={24}
            height={24}
            className="w-full h-full object-contain"
            priority
          />
        </div>
        BOTEPCO BW.
      </a>
    </div>

    {/* Registration Form Section */}
    <div className="flex flex-1 items-start justify-center pt-4 lg:pt-8">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
            Create your account
          </h1>
          <p className="text-muted-foreground mt-4 text-lg">
            Join BOTEPCO to access teacher registration and licensing services
          </p>
        </div>

        <div className="mb-8">
          <RegistrationForm />
        </div>

        <div className="text-center text-sm">
          <p className="text-muted-foreground">
            Already have an account?{" "}
            <a
              href="/customer/signin"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>

    {/* Terms note */}
    <div className="flex justify-center">
      <p className="text-xs text-muted-foreground text-center max-w-md">
        By creating an account, you agree to our{" "}
        <a
          href="/terms"
          target="_blank"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Terms and Conditions of Use
        </a>{" "}

        and{" "}

        <a
          href="/privacy"
          className="font-medium text-primary underline-offset-4 hover:underline"
          target="_blank"
        >
          Privacy Policy
        </a>
        . Your information is securely protected and will only be used for
        registration purposes.
      </p>
    </div>
  </div>

  {/* Right Column — Image fits available space */}
  <div className="relative w-full h-full overflow-hidden hidden lg:block">
    <Image
      src="/landing.jpg"
      alt="Botepco registration background"
      fill
      className="object-cover object-center dark:brightness-[0.5] dark:grayscale"
      priority
    />
    <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/60 to-transparent" />
    <div className="absolute bottom-10 left-8 right-8">
      <blockquote className="text-blue-700 max-w-2xl">
        <p className="text-xl font-medium leading-relaxed lg:text-2xl">
          &#34;Empowering educators through streamlined registration and
          professional development opportunities&#34;
        </p>
        <footer className="mt-4 text-sm opacity-80">
          — BOTEPCO Teacher Registration & Licensing Services
        </footer>
      </blockquote>
    </div>
  </div>
</div>

  );
}
