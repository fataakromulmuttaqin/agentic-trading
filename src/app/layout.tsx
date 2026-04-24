import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trading Dashboard | Kraken + Hermes",
  description: "AI-powered trading dashboard with Kraken exchange integration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
