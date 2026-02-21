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
        className={`${geistSans.variable} ${geistMono.variable} min-h-[100dvh] flex flex-col antialiased text-gray-900`}
      >
        <Header />
        <main className="flex-1 pb-8">
          <div className="max-w-[1440px] mx-auto w-full px-3 sm:px-4 md:px-6 lg:px-12 py-8 md:py-10 lg:py-14">
            {children}
          </div>
        </main>
        <Footer />
      </body>
    </html>
  );
}
