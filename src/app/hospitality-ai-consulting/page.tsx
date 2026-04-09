import type { Metadata } from "next";
import Link from "next/link";
import StickyNav from "@/components/StickyNav";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import ConsultingCTA from "@/components/ConsultingCTA";

export const metadata: Metadata = {
  title: "Hospitality AI Consulting | Heard Hospitality Group",
  description:
    "Hospitality AI consulting services including AI search optimization, catering revenue strategy, automation infrastructure, and restaurant digital systems.",
  alternates: {
    canonical: "https://heardhospitalitygroup.com/hospitality-ai-consulting",
  },
};

const services = [
  { title: "AI Search Optimization", desc: "Position your restaurant to be surfaced and recommended by AI search platforms and voice assistants." },
  { title: "Catering Revenue Strategy", desc: "Design and deploy catering funnels that capture, qualify, and convert inquiries into booked revenue." },
  { title: "Automation Infrastructure", desc: "Replace manual follow-up, scheduling, and task routing with backend automation systems." },
  { title: "Restaurant Digital Systems", desc: "Build the operational backbone — CRM, dashboards, lead capture, and reporting — that scales with your business." },
];

export default function ConsultingPage() {
  return (
    <div className="min-h-screen bg-deep-gradient text-foreground">
      <StickyNav />

      <main className="pt-28 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Hospitality AI Consulting
          </h1>
          <p className="text-muted-foreground text-lg mb-14 max-w-2xl">
            Strategic consulting for operators ready to install revenue infrastructure that compounds.
          </p>

          <div className="space-y-6 mb-16">
            {services.map((s) => (
              <div key={s.title} className="rounded-lg border border-border bg-card p-6">
                <h3 className="font-semibold text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <ConsultingCTA />

          {/* Internal links */}
          <div className="flex flex-wrap gap-3 border-t border-border pt-10">
            <Button asChild variant="outline" size="sm">
              <Link href="/about-heard-hospitality-group">About HHG <ArrowRight size={14} /></Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/ai-revenue-systems">AI Revenue Systems <ArrowRight size={14} /></Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
