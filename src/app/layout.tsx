import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "@/components/providers/web3-provider";
import { Navbar } from '@/components/layout/navbar';

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
        <Web3Provider>
          <Navbar />
        {children}
        </Web3Provider>
      </body>
    </html>
  );
}
