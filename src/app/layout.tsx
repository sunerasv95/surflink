import type { Metadata } from "next";
import { Barlow } from "next/font/google";
import { GoogleAnalytics } from "@/components/google-analytics";
import "./globals.css";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-barlow",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SurfLink | The Local Surf Community",
  description: "One platform to trade your quiver, find your local crew, and discover the best breaks. Join the waitlist.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${barlow.variable} antialiased`}>
        {/* TODO: Replace with actual Measurement ID from env or config */}
        <GoogleAnalytics gaId="G-PLACEHOLDER" />
        {children}
      </body>
    </html>
  );
}
