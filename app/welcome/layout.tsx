import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Welcome to Botepco e-Services Portal",
  description: "Teacher registration and licensing system for Botepco",
  icons: {
    icon: '/Code-of-Arms-colour.png'
  }
};

interface WelcomeLayoutProps {
  children: React.ReactNode;
}

export default function WelcomeLayout({ children }: WelcomeLayoutProps) {
  return (
    <>
      <header>
        <nav>{/* Add navigation items here */}</nav>
      </header>
      <main>{children}</main>
      <footer>{/* Add footer content here */}</footer>
    </>
  );
}