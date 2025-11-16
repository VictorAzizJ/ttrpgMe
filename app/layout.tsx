import type { Metadata } from "next";
import "./globals.css";

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
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
