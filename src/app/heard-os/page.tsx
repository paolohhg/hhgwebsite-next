import type { Metadata } from "next";
import StickyNav from "@/components/StickyNav";
import HeardOSHero from "@/components/heardos/HeardOSHero";
import HeardOSPain from "@/components/heardos/HeardOSPain";
import HeardOSFeatures from "@/components/heardos/HeardOSFeatures";
import HeardOSFlow from "@/components/heardos/HeardOSFlow";
import HeardOSWalkthrough from "@/components/heardos/HeardOSWalkthrough";
import HeardOSPricing from "@/components/heardos/HeardOSPricing";
import HeardOSRoadmap from "@/components/heardos/HeardOSRoadmap";
import HeardOSFinalCTA from "@/components/heardos/HeardOSFinalCTA";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Heard OS — Inventory Control for Restaurants | Heard Hospitality Group",
  description:
    "Heard OS v1 is a zone-based inventory control platform built for independent restaurant operators. Track counts, set par levels, export data, and build consistency.",
  alternates: {
    canonical: "https://heardhospitalitygroup.com/heard-os",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is Heard OS?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Heard OS is an inventory control platform built for independent restaurant operators. It provides zone-based count tracking, par level visibility, count history, and export capabilities.",
      },
    },
    {
      "@type": "Question",
      name: 'What is a "zone-based" inventory?',
      acceptedAnswer: {
        "@type": "Answer",
        text: "Zone-based inventory assigns items to physical storage locations — walk-in, dry storage, freezer, bar — so counts match how your kitchen actually operates.",
      },
    },
    {
      "@type": "Question",
      name: "Can I export counts?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Heard OS supports CSV exports for vendors, spreadsheets, or accounting integration.",
      },
    },
    {
      "@type": "Question",
      name: "Can multiple staff count at once?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Multi-user counting with controlled permissions is available on the Pro plan.",
      },
    },
    {
      "@type": "Question",
      name: "Is this connected to HHG infrastructure installs?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Heard OS is the foundation layer of the HHG revenue infrastructure platform. The Infrastructure plan includes full HHG install with data layer and automation integration.",
      },
    },
  ],
};

export default function HeardOSPage() {
  return (
    <div className="min-h-screen bg-deep-gradient text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <StickyNav />
      <HeardOSHero />
      <HeardOSPain />
      <HeardOSFeatures />
      <HeardOSFlow />
      <HeardOSWalkthrough />
      <HeardOSPricing />
      <HeardOSRoadmap />
      <HeardOSFinalCTA />
      <Footer />
    </div>
  );
}
