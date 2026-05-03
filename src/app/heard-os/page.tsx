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
  title: "Heard OS - Operator Systems Direction | Heard Hospitality Group",
  description:
    "Heard OS is the internal operating system direction behind HHG's work to structure projects, tasks, assets, and operator workflows.",
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
        text: "Heard OS is the operating system direction behind HHG's internal coordination and operator workflow thinking. Public product packaging is still being defined.",
      },
    },
    {
      "@type": "Question",
      name: "Is Heard OS a public inventory product today?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The current public direction is being clarified. HHG is using Heard OS language for internal operating structure and future workflow systems, but this page avoids promising a public inventory product or plan availability.",
      },
    },
    {
      "@type": "Question",
      name: "What kinds of workflows inform Heard OS?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "HHG's operating context includes catering operations, meal prep systems, high-volume kitchen workflows, third-party delivery optimization, revenue management, and margin management.",
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
