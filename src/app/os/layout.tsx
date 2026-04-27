import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-os-sans",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-os-mono",
});

export const metadata: Metadata = {
  title: "Heard OS",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function OsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${inter.variable} ${mono.variable} bg-white text-black min-h-screen antialiased`}
      style={{
        fontFamily: "var(--font-os-sans), system-ui, sans-serif",
        ["--tw-prose-body" as string]: "#000",
      }}
    >
      <style>{`
        .font-mono, .tabular-nums {
          font-family: var(--font-os-mono), ui-monospace, monospace;
          font-variant-numeric: tabular-nums;
        }
      `}</style>
      {children}
    </div>
  );
}
