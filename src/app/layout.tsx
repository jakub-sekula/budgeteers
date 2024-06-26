import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Nav from "@/components/Nav";
import clsx from "clsx";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Budget tracker",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={clsx(inter.className, "h-full flex flex-col bg-neutral-100")}
      >
        <Providers>
          <Nav />
          <main className="max-w-6xl w-full mx-auto py-6 grid gap-6">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
