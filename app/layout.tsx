import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Todo App",
  description: "A modern todo application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="flex justify-center items-start min-h-screen bg-background text-foreground">
          <div className="w-full max-w-2xl p-4 sm:p-6 md:p-8">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}

