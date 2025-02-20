import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SayHalo - SLM Aggregator",
  description:
    "AI-powered (gen-ai) SLM Aggregator for seamless chat experience",
  openGraph: {
    title: "SayHalo - SLM Aggregator",
    description:
      "SayHalo is an AI-powered (gen-ai) SLM Aggregator designed for seamless chat experience. Early access available now!",
    images: ["/thumbnail.png"], // Assuming the image is at /public/thumbnail.png
  },
  twitter: {
    card: "summary_large_image",
    title: "SayHalo - SLM Aggregator",
    description:
      "SayHalo is an AI-powered (gen-ai) SLM Aggregator designed for seamless chat experience. Early access available now!",
    images: ["/thumbnail.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
            <Analytics />

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
