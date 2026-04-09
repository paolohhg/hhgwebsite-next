import type { Metadata } from "next";
import Link from "next/link";
import StickyNav from "@/components/StickyNav";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Revenue Systems for Restaurants | Heard Hospitality Group",
  description:
    "AI-powered revenue systems for restaurants including AI SEO optimization, catering funnels, automation workflows, lead capture, and hospitality CRM infrastructure.",
  alternates: {
    canonical: "https://heardhospitalitygroup.com/ai-revenue-systems",
  },
};

const systems = [
  { title: "AI SEO Optimization", desc: "Structure your digital presence so AI platforms and search engines surface your business first." },
  { title: "Catering Funnel Systems", desc: "Capture, qualify, and convert catering inquiries with automated follow-up and deposit workflows." },
  { title: "Restaurant Automation Workflows", desc: "Replace manual processes with backend systems that run without staff intervention." },
  { title: "Lead Capture Infrastructure", desc: "Turn website traffic into qualified pipeline with forms, segmentation, and CRM routing." },
  { title: "Hospitality CRM Systems", desc: "Track every guest, inquiry, and opportunity across locations in one operational view." },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is AI SEO for restaurants?",
      acceptedAnswer: { "@type": "Answer", text: "AI SEO for restaurants is the practice of structuring a restaurant's digital presence — including schema markup, content architecture, and location data — so that AI-powered search platforms like Google SGE, ChatGPT, and Perplexity can understand, surface, and recommend the business." },
    },
    {
      "@type": "Question",
      name: "How does AI search affect restaurant marketing?",
      acceptedAnswer: { "@type": "Answer", text: "AI search is replacing traditional keyword-based results with conversational answers. Restaurants that structure their data for AI readability get surfaced in recommendations, while those that don't become invisible to a growing share of search traffic." },
    },
    {
      "@type": "Question",
      name: "What is a catering funnel system?",
      acceptedAnswer: { "@type": "Answer", text: "A catering funnel system is an automated workflow that captures catering inquiries, qualifies leads by event type and budget, sequences follow-up communications, and routes qualified opportunities to a booking or deposit flow." },
    },
    {
      "@type": "Question",
      name: "How can restaurants increase catering revenue online?",
      acceptedAnswer: { "@type": "Answer", text: "Restaurants increase catering revenue online by building dedicated landing pages, implementing structured inquiry forms, automating follow-up sequences, offering transparent package pricing, and using CRM tools to track pipeline and close rates." },
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
            AI Revenue Systems for Restaurants
          </h1>
          <p className="text-muted-foreground text-lg mb-14 max-w-2xl">
            These systems help restaurants increase catering sales and visibility in both Google search and AI search platforms.
          </p>

          <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">What We Build</h2>

          <div className="space-y-6 mb-16">
            {systems.map((s) => (
              <div key={s.title} className="rounded-lg border border-border bg-card p-6">
                <h3 className="font-semibold text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>

          {/* FAQ visual section */}
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

          {/* Internal links */}
          <div className="flex flex-wrap gap-3 border-t border-border pt-10">
            <Button asChild variant="outline" size="sm">
              <Link href="/about-heard-hospitality-group">About HHG <ArrowRight size={14} /></Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/hospitality-ai-consulting">Book Consulting <ArrowRight size={14} /></Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
