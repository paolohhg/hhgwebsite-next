import type { Metadata } from "next";
import Link from "next/link";
import StickyNav from "@/components/StickyNav";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Hospitality Systems for Food Operators | Heard Hospitality Group",
  description:
    "Practical hospitality systems for contracts, catering pricing, lead response, and food business launch workflows.",
  alternates: {
    canonical: "https://heardhospitalitygroup.com/ai-revenue-systems",
  },
};

const systems = [
  { title: "ContractForge", desc: "A live AI-assisted contract generation tool for branded catering agreements, vendor agreements, NDAs, and service contracts." },
  { title: "Pan Pricer (planned)", desc: "A planned catering pricing calculator for ingredient cost input, portion and yield math, and suggested pricing outputs." },
  { title: "Business-in-a-Box Systems", desc: "System packages under development for catering, meal prep, and food truck businesses, including landing pages, CTAs, forms, and response workflows." },
  { title: "Lead Response Infrastructure", desc: "Forms, routing, and automated reply workflows built so inbound interest does not sit unanswered." },
  { title: "Operator Dashboards", desc: "Lightweight operational views for tracking the work that usually gets scattered across spreadsheets and inboxes." },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What does Heard Hospitality Group build?",
      acceptedAnswer: { "@type": "Answer", text: "Heard Hospitality Group builds practical systems, tools, and workflow infrastructure for food and service operators, including contract generation, pricing structure, lead response, and food business launch systems." },
    },
    {
      "@type": "Question",
      name: "Is ContractForge available now?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. ContractForge is a live web-based AI contract generation tool that helps users create formatted branded contract drafts from structured inputs." },
    },
    {
      "@type": "Question",
      name: "Is Pan Pricer available now?",
      acceptedAnswer: { "@type": "Answer", text: "Pan Pricer is planned. It is intended to help food operators build baseline catering pricing structure using ingredient costs, portions, yields, and suggested pricing outputs." },
    },
    {
      "@type": "Question",
      name: "What are Business-in-a-Box Systems?",
      acceptedAnswer: { "@type": "Answer", text: "Business-in-a-Box Systems are a product direction under development for preconfigured food business launch systems, starting with catering, meal prep, and food truck categories." },
    },
  ],
};

export default function AIRevenueSystemsPage() {
  return (
    <div className="min-h-screen bg-deep-gradient text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <StickyNav />

      <main className="pt-28 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Hospitality Systems for Food Operators
          </h1>
          <p className="text-muted-foreground text-lg mb-14 max-w-2xl">
            HHG builds modular tools for the core business functions that food operators usually handle with scattered documents, spreadsheets, forms, and follow-up.
          </p>

          <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">What HHG Is Building</h2>

          <div className="space-y-6 mb-16">
            {systems.map((s) => (
              <div key={s.title} className="rounded-lg border border-border bg-card p-6">
                <h3 className="font-semibold text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>

          <section className="mb-16">
            <h2 className="text-xl font-semibold text-foreground mb-6">Frequently Asked Questions</h2>
            <div className="space-y-5">
              {faqSchema.mainEntity.map((q) => (
                <div key={q.name} className="border-b border-border pb-5">
                  <h3 className="font-medium text-foreground mb-2">{q.name}</h3>
                  <p className="text-sm text-muted-foreground">{q.acceptedAnswer.text}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="flex flex-wrap gap-3 border-t border-border pt-10">
            <Button asChild variant="outline" size="sm">
              <Link href="/contract-forge">Open ContractForge <ArrowRight size={14} /></Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/#contact">Contact HHG <ArrowRight size={14} /></Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
