import type { Metadata } from "next";
import Link from "next/link";
import StickyNav from "@/components/StickyNav";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About Heard Hospitality Group | Hospitality Systems Builder",
  description:
    "Heard Hospitality Group builds practical tools and workflow systems for food and service operators, led by hospitality operator Paolo Nucum.",
  alternates: {
    canonical: "https://heardhospitalitygroup.com/about-heard-hospitality-group",
  },
};

const industries = [
  "Catering operators",
  "Meal prep businesses",
  "Food trucks",
  "Restaurants",
  "Hospitality and adjacent service businesses",
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-deep-gradient text-foreground">
      <StickyNav />

      <main className="pt-28 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-10">
            About Heard Hospitality Group
          </h1>

          <section className="mb-14">
            <h2 className="text-xl font-semibold text-foreground mb-3">Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              Heard Hospitality Group builds practical systems, tools, and workflow infrastructure for food and service operators. The work is focused on reducing operational friction, standardizing core business functions, and making useful systems more accessible.
            </p>
          </section>

          <section className="mb-14">
            <h2 className="text-xl font-semibold text-foreground mb-3">Founder</h2>
            <p className="text-muted-foreground leading-relaxed">
              Paolo Nucum is an active hospitality operator with experience across catering operations, meal prep systems, high-volume kitchen workflows, third-party delivery optimization, revenue management, and margin management.
            </p>
          </section>

          <section className="mb-14">
            <h2 className="text-xl font-semibold text-foreground mb-3">Operating Context</h2>
            <p className="text-muted-foreground leading-relaxed">
              HHG uses LASA HTX, an owned brand, as a live environment for testing systems. Fit Kitchen Meals is a separate, non-owned operational environment where Paolo has involvement and additional real-world context.
            </p>
          </section>

          <section className="mb-14">
            <h2 className="text-xl font-semibold text-foreground mb-3">Philosophy</h2>
            <p className="text-muted-foreground leading-relaxed">
              Operators should not need a stack of expensive, disconnected tools to handle contracts, pricing, lead response, and basic funnel infrastructure. HHG builds multi-function, workflow-oriented systems designed around how hospitality work actually moves.
            </p>
          </section>

          <section className="mb-14">
            <h2 className="text-xl font-semibold text-foreground mb-3">Who HHG Builds For</h2>
            <ul className="space-y-2">
              {industries.map((i) => (
                <li key={i} className="text-muted-foreground flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  {i}
                </li>
              ))}
            </ul>
          </section>

          <div className="flex flex-wrap gap-3 border-t border-border pt-10">
            <Button asChild variant="outline" size="sm">
              <Link href="/ai-revenue-systems">Explore Systems <ArrowRight size={14} /></Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/contract-forge">Open ContractForge <ArrowRight size={14} /></Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
