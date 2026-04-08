import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteNav } from "@/components/site-nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "K-PULSE | The Reality Engine for Kerala",
  description:
    "A mobile-first living feed for Kerala youth: economy, jobs, migration, politics, and personal life decisions in one real-time surface."
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-canvas text-white antialiased">
        <SiteNav />
        {children}
      </body>
    </html>
  );
}
