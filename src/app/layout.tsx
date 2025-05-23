import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/ThemeProvider";
import QueryProvider from "@/components/QueryClient";
import StoreProvider from "@/components/StoreProvider";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "../components/ui/sonner";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: "Budget Tracker",
  description: "Your Daily Expense Tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${rubik.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <StoreProvider>
            <SessionProvider>
              <QueryProvider>
                {children}
                <Toaster richColors />
              </QueryProvider>
            </SessionProvider>
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
