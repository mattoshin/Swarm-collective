import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, VT323 } from "next/font/google";
import { MatrixRain } from "@/components/matrix-rain";
import "./globals.css";

const mono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

const display = VT323({
  variable: "--font-vt323",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Swarm Collective",
  description:
    "An invite-only network. Get introduced, join the directory, bring others in.",
};

export const viewport: Viewport = {
  themeColor: "#030703",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${mono.variable} ${display.variable} dark h-full antialiased`}
    >
      <body className="relative flex min-h-full flex-col">
        <MatrixRain />
        <div aria-hidden className="crt-overlay" />
        <div className="relative z-10 flex flex-1 flex-col">{children}</div>
      </body>
    </html>
  );
}
