import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script"; // ✅ Import Script component
import "./globals.css";
import PuterInitializer from "@/components/PuterInitializer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CVanalyze",
  description: "Analyze your CV in seconds find loopholes and score your cv",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PuterInitializer/>
        {children}

        {/* ✅ Load external Puter JS */}
        <Script src="https://js.puter.com/v2/" strategy="afterInteractive" />

        {/* ✅ Inline script for the chat */}
        <Script id="puter-ai-chat" strategy="afterInteractive">
          {`
            puter.ai.chat("Why did the chicken cross the road?")
              .then((response) => {
                puter.print(response);
              });
          `}
        </Script>
      </body>
    </html>
  );
}
