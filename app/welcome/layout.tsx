import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Welcome",
  description: "Welcome",
};

export default function WelcomeLayout({
    children, // will be a page or nested layout
  }: {
    children: React.ReactNode
  }) {
    return (
      <section>
        <nav></nav>
        {children}
      </section>
    )
  }