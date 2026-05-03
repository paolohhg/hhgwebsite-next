import type { Metadata } from "next";
import Link from "next/link";
import StickyNav from "@/components/StickyNav";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import ConsultingCTA from "@/components/ConsultingCTA";

export const metadata: Metadata = {
  title: "Hospitality Systems Consulting | Heard Hospitality Group",
  description:
    "Operator-led consulting for hospitality workflows, including contracts, pricing structure, lead response, automation, and food business systems.",
  alternates: {
    canonical: "https://heardhospitalitygroup.com/hospitality-ai-consulting",
  },
};

const services = [
  { title: "Contract Workflow Review", desc: "Standardize how agreements are requested, drafted, branded, reviewed, and sent." },
  { title: "Catering Pricing Structure", desc: "Map the pricing inputs operators need before Pan Pricer or another calculator can produce useful outputs." },
  { title: "Lead Response Systems", desc: "Design forms, routing, and automated response workflows so inquiries do not stall in an inbox." },
  { title: "Food Business Launch Systems", desc: "Structure the basic website, CTA, lead capture, and response layers for catering, meal prep, or food truck launches." },
];

export default function ConsultingPage() {
  return (
    <div className="min-h-screen bg-deep-gradient text-foreground">
      <StickyNav />

      <main className="pt-28 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Hospitality Systems Consulting
          </h1>
          <p className="text-muted-foreground text-lg mb-14 max-w-2xl">
            Operator-led systems work for food businesses that need clearer contracts, pricing, lead response, and workflow structure.
          </p>

          <div className="space-y-6 mb-16">
            {services.map((s) => (
              <div key={s.title} className="rounded-lg border border-border bg-card p-6">
                <h3 className="font-semibold text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>

          <ConsultingCTA />

          <div className="flex flex-wrap gap-3 border-t border-border pt-10">
            <Button asChild variant="outline" size="sm">
              <Link href="/about-heard-hospitality-group">About HHG <ArrowRight size={14} /></Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/ai-revenue-systems">Systems <ArrowRight size={14} /></Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
