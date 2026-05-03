"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const scrollTo = (id: string) => document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });

const modules = [
  { title: "ContractForge", desc: "Branded contract drafts for catering, vendors, NDAs, and service work.", href: "#contracts" },
  { title: "Pan Pricer", desc: "Planned catering pricing calculator for cost, yield, and margin structure.", href: "#pricing" },
  { title: "Business-in-a-Box", desc: "Food business launch systems for catering, meal prep, and food trucks.", href: "#business-box" },
  { title: "Lead Response Workflows", desc: "Forms, routing, and automated replies that prevent missed inquiries.", href: "#workflow" },
  { title: "Live Test Environments", desc: "Systems informed by LASA HTX and Fit Kitchen Meals operations.", href: "#field-tested" },
];

export default function HeroSection() {
  return (
    <section id="top" className="infra-pattern infra-beams hero-glow relative pt-28 pb-28 px-6 overflow-hidden">
      <div
        className="hero-atmosphere"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200&q=80&auto=format')",
        }}
      />
      <div className="hero-depth absolute inset-0 pointer-events-none" />
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.08] mb-6">
            Hospitality Systems<br />
            <span className="text-foreground">for Food Operators.</span>
          </h1>
          <p className="text-xl text-muted-foreground font-medium mb-3">Less friction. More structure.</p>
          <p className="text-muted-foreground max-w-xl mb-16">
            Heard Hospitality Group builds practical tools and workflows for contracts, pricing, lead response, and food business operations.
          </p>
        </div>

        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6" id="solutions">System Modules</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {modules.map((m) => (
            <button
              key={m.href}
              onClick={() => scrollTo(m.href)}
              className="text-left rounded-lg bg-card border border-border p-5 hover:border-primary/40 transition-colors"
            >
              <h3 className="font-semibold text-foreground mb-1 text-sm">{m.title}</h3>
              <p className="text-sm text-muted-foreground">{m.desc}</p>
            </button>
          ))}
        </div>

        <Button onClick={() => scrollTo("#assessment")} size="lg" className="gap-2">
          Review Your System Gaps <ArrowRight size={16} />
        </Button>
        <div className="mt-4">
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Operator-led systems builder</p>
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Based in Houston, Texas</p>
        </div>
      </div>
    </section>
  );
}
