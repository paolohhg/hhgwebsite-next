import type { Metadata } from "next";
import { QueryProvider } from "@/components/providers/query-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Heard Hospitality Group | Hospitality Systems for Operators",
  description:
    "Heard Hospitality Group builds practical systems, tools, and workflow infrastructure for food and service operators.",
  authors: [{ name: "Heard Hospitality Group" }],
  openGraph: {
    title: "Heard Hospitality Group | Hospitality Systems for Operators",
    description:
      "Practical systems, tools, and workflow infrastructure for hospitality, food, and service operators.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            {children}
          </TooltipProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
