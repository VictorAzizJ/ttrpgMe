import type { Metadata } from "next";
import "./globals.css";
import { UserProvider } from "@/contexts/UserContext";
import GlobalNav from "@/components/navigation/GlobalNav";

export const metadata: Metadata = {
  title: "TTRPG Platform - AI-Powered Tabletop Gaming",
  description: "Play TTRPGs with AI Dungeon Masters and powerful gaming tools",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-gray-950">
        <UserProvider>
          <GlobalNav />
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
