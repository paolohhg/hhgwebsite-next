import type { Metadata } from "next";
import StickyNav from "@/components/StickyNav";
import Footer from "@/components/Footer";
import ContractForgeApp from "@/components/contractforge/ContractForgeApp";

export const metadata: Metadata = {
  title: "ContractForge — AI Contract Generator | Heard Hospitality Group",
  description:
    "Generate branded, professional contracts in seconds. Service agreements, NDAs, catering contracts, and more — powered by AI with your logo and company info built in.",
};

export default function ContractForgePage() {
  return (
    <div className="min-h-screen bg-deep-gradient text-foreground">
      <StickyNav />
      <ContractForgeApp />
      <Footer />
    </div>
  );
}
