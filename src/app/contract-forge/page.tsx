import type { Metadata } from "next";
import StickyNav from "@/components/StickyNav";
import Footer from "@/components/Footer";
import ContractForgeApp from "@/components/contractforge/ContractForgeApp";

export const metadata: Metadata = {
  title: "ContractForge - AI Contract Generator | Heard Hospitality Group",
  description:
    "Generate branded contract drafts for catering agreements, vendor agreements, NDAs, service contracts, and other operator workflows.",
  alternates: {
    canonical: "https://heardhospitalitygroup.com/contract-forge",
  },
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
