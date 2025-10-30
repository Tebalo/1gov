import Image from "next/image";
import { RegistrationForm } from "../components/registration-form";

export default function UserRegistrationPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Left Column — Registration Form */}
      <div className="flex flex-col gap-4 p-6 md:p-10">
        {/* Logo + Brand */}
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex items-center gap-2 font-medium">
            <div className="relative w-6 h-6">
              <Image
                src="/botepco.png"
                alt="Coat-of-arms"
                fill
                className="object-contain"
                priority
              />
            </div>
            BOTEPCO BW.
          </a>
        </div>

        {/* Registration Form Section */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">
                Create your account
              </h1>
              <p className="text-muted-foreground mt-2 text-sm">
                Join BOTEPCO to access teacher registration and licensing services
              </p>
            </div>

            <RegistrationForm />

            <div className="mt-6 text-center text-sm">
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
        <div className="text-center">
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
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
            . Your information is securely protected.
          </p>
        </div>
      </div>

      {/* Right Column — Image section */}
      <div className="bg-muted relative hidden lg:block">
        <Image
          src="/landing.jpg"
          alt="Image"
          fill
          className="object-cover dark:brightness-[0.2] dark:grayscale"
          priority
        />
        <div className="absolute bottom-6 left-6 right-6">
          <blockquote className="text-black max-w-md mx-auto text-center">
            <p className="text-lg font-medium leading-relaxed">
              &#34;Empowering educators through streamlined registration&#34;
            </p>
            <footer className="mt-2 text-sm opacity-80">
              — BOTEPCO Teacher Services
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
}