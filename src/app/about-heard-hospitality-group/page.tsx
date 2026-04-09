import type { Metadata } from "next";
import Link from "next/link";
import StickyNav from "@/components/StickyNav";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About Heard Hospitality Group | Hospitality Revenue Infrastructure",
  description:
    "Heard Hospitality Group was founded to help restaurants and hospitality businesses grow revenue using modern AI tools, automation systems, and digital infrastructure designed by operators.",
  alternates: {
    canonical: "https://heardhospitalitygroup.com/about-heard-hospitality-group",
  },
};

const industries = [
  "Restaurants",
  "Catering companies",
  "Food startups",
  "Hospitality brands",
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

          {/* Mission */}
          <section className="mb-14">
            <h2 className="text-xl font-semibold text-foreground mb-3">Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              Heard Hospitality Group was founded to help restaurants and hospitality businesses grow revenue using modern AI tools, automation systems, and digital infrastructure designed by operators.
            </p>
          </section>

          {/* Founder */}
          <section className="mb-14">
            <h2 className="text-xl font-semibold text-foreground mb-3">Founder</h2>
            <p className="text-muted-foreground leading-relaxed">
              Paolo Nucum is a hospitality operator and entrepreneur with decades of experience in restaurant operations, catering systems, and hospitality growth strategy.
            </p>
          </section>

          {/* Philosophy */}
          <section className="mb-14">
            <h2 className="text-xl font-semibold text-foreground mb-3">Philosophy</h2>
            <p className="text-muted-foreground leading-relaxed">
              Operators should own their revenue infrastructure. Our systems are designed to increase catering revenue, improve AI search visibility, and automate operational tasks.
            </p>
          </section>

          {/* Industries */}
          <section className="mb-14">
            <h2 className="text-xl font-semibold text-foreground mb-3">Industries Served</h2>
            <ul className="space-y-2">
              {industries.map((i) => (
                <li key={i} className="text-muted-foreground flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  {i}
                </li>
              ))}
            </ul>
          </section>

          {/* Internal links */}
          <div className="flex flex-wrap gap-3 border-t border-border pt-10">
            <Button asChild variant="outline" size="sm">
              <Link href="/ai-revenue-systems">Explore AI Revenue Systems <ArrowRight size={14} /></Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/hospitality-ai-consulting">Consulting Services <ArrowRight size={14} /></Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
