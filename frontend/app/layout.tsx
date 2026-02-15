import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UaRP — текстові рольові ігри",
  description: "UaRP — простір українськомовних текстових рольових ігор",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-gray-900`}
      >
        <Header />
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-10 sm:py-14">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
