import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "TechServe Pro - Precision Engineering in Service Delivery",
  description:
    "Connect with rigorously vetted technical experts for your high-end property needs. Quality and efficiency, guaranteed.",
};

export const viewport: Viewport = {
  themeColor: "#fcf8fa",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth bg-background">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${inter.variable} font-sans bg-background text-on-background selection:bg-secondary-container selection:text-on-secondary-container min-h-screen antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
