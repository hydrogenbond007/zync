import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { OriginProvider } from "@/components/providers/origin-provider";
import { Navbar } from '@/components/layout/navbar';
import ToastProvider from "@/components/ui/ToastProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zync - IP Ownership Markets",
  description: "Decentralized platform for video content creators to tokenize and monetize their IP",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <OriginProvider clientId={process.env.NEXT_PUBLIC_CAMP_CLIENT_ID || 'default-client-id'}>
          <ToastProvider>
            <Navbar />
            {children}
          </ToastProvider>
        </OriginProvider>
      </body>
    </html>
  );
}
