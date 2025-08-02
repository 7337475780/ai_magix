import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import SessionWrapper from "@/components/SessionWrapper";
import ToasterProvider from "@/components/ToasterProvider";
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: "600",
});

export const metadata: Metadata = {
  title: "AIMagix",
  description: "Generate images with AI for free",
  icons: {
    icon: "/images/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        {/* ✅ Wrap app with SessionProvider */}
        <SessionWrapper>
          <Navbar />
          <ToasterProvider />
          <main>{children}</main>
          {/* Optional footer component instead of plain text */}
          <footer className="text-center mt-8 text-gray-500 text-sm">
            © {new Date().getFullYear()} AIMagix. All rights reserved.
          </footer>
        </SessionWrapper>
      </body>
    </html>
  );
}
