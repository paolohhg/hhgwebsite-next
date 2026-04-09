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
    "Heard Hospitality Group develops AI-powered revenue infrastructure for restaurants, hospitality operators, and food businesses. Systems include AI SEO optimization, catering funnels, automation platforms, and digital growth tools.",
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
  industry: "Hospitality Technology / Restaurant Revenue Systems",
  sameAs: [
    "https://www.linkedin.com/company/heardhospitalitygroup",
    "https://www.facebook.com/heardhospitalitygroup",
    "https://www.instagram.com/heardhospitalitygroup",
    "https://twitter.com/heabordhospgrp",
  ],
};

const anchorSections = [
  {
    id: "catering",
    title: "Catering Revenue Architecture",
    description: "Structured inquiry capture, follow-up sequencing, and deposit workflows.",
    bullets: [
      "Catering landing page + inquiry segmentation",
      "Automated follow-up + reminders",
      "Package structure + add-ons",
      "Deposit-ready booking flow",
      "CRM pipeline visibility",
    ],
  },
  {
    id: "ai-search",
    title: "AI Visibility Architecture",
    description: "AI discovery is replacing traditional search. Structure your presence to be understood, surfaced, and chosen.",
    bullets: [
      "Schema architecture",
      "AI-readable page structure",
      "Location clarity",
      "Authority content framework",
      "Search visibility stability",
    ],
  },
  {
    id: "reactivation",
    title: "Retention Infrastructure",
    description: "Repeat revenue requires structured follow-up.",
    bullets: [
      "Review request system",
      "Winback campaigns",
      "VIP list segmentation",
      "30/60/90 day automation",
      "Reputation response framework",
    ],
  },
  {
    id: "ops-automation",
    title: "Operational Control Layer",
    description: "Manual workflows create instability. Backend control systems replace them.",
    bullets: [
      "Lead capture → CRM automation",
      "Proposal + deposit workflows",
      "Task routing + reminders",
      "Operational dashboards",
      "SOP-backed processes",
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
