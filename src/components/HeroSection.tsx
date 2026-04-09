"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const scrollTo = (id: string) => document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });

const modules = [
  { title: "Catering Revenue Architecture", desc: "Structured inquiry capture, follow-up sequencing, and deposit workflows.", href: "#catering" },
  { title: "AI Visibility Architecture", desc: "Schema, structured data, and AI-readable presence.", href: "#ai-search" },
  { title: "Retention Infrastructure", desc: "Automated guest follow-up and reactivation systems.", href: "#reactivation" },
  { title: "Operational Control Layer", desc: "Backend automation replacing manual workflows.", href: "#ops-automation" },
  { title: "Heard OS", desc: "Operator-focused inventory and operational control.", href: "#heard-os" },
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
            Revenue Infrastructure<br />
            <span className="text-foreground">for Hospitality Businesses.</span>
          </h1>
          <p className="text-xl text-muted-foreground font-medium mb-3">Stabilize first. Then scale.</p>
          <p className="text-muted-foreground max-w-xl mb-16">
            Revenue inconsistency is <span className="text-primary">structural.</span>
          </p>
        </div>

        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6" id="solutions">Infrastructure Modules</p>

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
          Begin Infrastructure Review <ArrowRight size={16} />
        </Button>
        <div className="mt-4">
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Independent Infrastructure Operator</p>
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Based in Houston, Texas</p>
        </div>
      </div>
    </section>
  );
}
