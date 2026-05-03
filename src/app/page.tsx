import type { Metadata } from "next";
import StickyNav from "@/components/StickyNav";
import HeroSection from "@/components/HeroSection";
import InfraStatusSection from "@/components/InfraStatusSection";
import InstabilitySection from "@/components/InstabilitySection";
import StackSection from "@/components/StackSection";
import PlatformArchitectureSection from "@/components/PlatformArchitectureSection";
import MachineSection from "@/components/MachineSection";
import AnchorSection from "@/components/AnchorSection";
import HeardOSPreview from "@/components/HeardOSPreview";
import AssessmentSection from "@/components/AssessmentSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { HashScrollHandler } from "@/components/providers/hash-scroll-handler";

export const metadata: Metadata = {
  alternates: { canonical: "https://heardhospitalitygroup.com/" },
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Heard Hospitality Group",
  url: "https://heardhospitalitygroup.com",
  description:
    "Heard Hospitality Group develops practical systems, tools, and workflow infrastructure for restaurants, hospitality operators, and food businesses. Work includes contract generation, catering pricing structure, lead response workflows, and business launch systems.",
  founder: {
    "@type": "Person",
    name: "Paolo Nucum",
  },
  foundingLocation: {
    "@type": "Place",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Houston",
      addressRegion: "TX",
      addressCountry: "US",
    },
  },
  areaServed: {
    "@type": "Country",
    name: "United States",
  },
  industry: "Hospitality Technology / Food Business Operating Systems",
  sameAs: [
    "https://www.linkedin.com/company/heardhospitalitygroup",
    "https://www.facebook.com/heardhospitalitygroup",
    "https://www.instagram.com/heardhospitalitygroup",
    "https://twitter.com/heabordhospgrp",
  ],
};

const anchorSections = [
  {
    id: "contracts",
    title: "Contract Systems",
    description: "ContractForge helps operators generate branded agreement drafts from structured inputs.",
    bullets: [
      "Catering agreements",
      "Vendor agreements",
      "NDAs and service contracts",
      "Branding assets built into the document",
      "Formatted draft output ready for operator review",
    ],
  },
  {
    id: "pricing",
    title: "Pricing Structure",
    description: "Pan Pricer is planned as a catering pricing calculator for operators without a reliable pricing model.",
    bullets: [
      "Ingredient cost input",
      "Portion and yield calculations",
      "Suggested pricing outputs",
      "Baseline margin structure",
      "Underpricing risk reduction",
    ],
  },
  {
    id: "business-box",
    title: "Business-in-a-Box Systems",
    description: "Preconfigured system packages for launching or improving food businesses are under development.",
    bullets: [
      "Catering business systems",
      "Meal prep business systems",
      "Food truck business systems",
      "Landing pages and clear CTA structure",
      "Lead capture and automated response workflows",
    ],
  },
  {
    id: "workflow",
    title: "Workflow Infrastructure",
    description: "HHG builds practical workflows that reduce manual handoffs across leads, pricing, contracts, and operations.",
    bullets: [
      "Lead capture and response routing",
      "Proposal and agreement workflows",
      "Task routing and reminders",
      "Operator dashboards",
      "SOP-backed process structure",
    ],
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-deep-gradient text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <HashScrollHandler />
      <StickyNav />
      <HeroSection />
      <InfraStatusSection />
      <InstabilitySection />
      <StackSection />
      <PlatformArchitectureSection />
      <MachineSection />
      {anchorSections.map((s) => (
        <AnchorSection key={s.id} {...s} />
      ))}
      <HeardOSPreview />
      <AssessmentSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
