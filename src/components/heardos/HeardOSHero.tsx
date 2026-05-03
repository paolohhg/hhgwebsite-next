"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function HeardOSHero() {
  const scrollTo = (id: string) => document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="infra-pattern pt-28 pb-20 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-4">System Direction</p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] mb-4">
            Heard OS<br />Operator Control Layer
          </h1>
          <p className="text-lg text-muted-foreground mb-2">The internal operating system direction behind HHG.</p>
          <p className="text-sm text-muted-foreground mb-8 max-w-md">
            Heard OS is being used to organize projects, tasks, assets, and the repeatable workflows HHG builds for hospitality operators. Public product packaging is still being clarified.
          </p>
          <div className="flex flex-wrap gap-3 mb-3">
            <Button size="lg" className="gap-2" onClick={() => scrollTo("#contact")}>
              Contact HHG <ArrowRight size={16} />
            </Button>
            <Button variant="outline" size="lg" onClick={() => scrollTo("#how-it-works")}>
              See System Logic
            </Button>
          </div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Internal dashboard live. Public workflow products in development.
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 min-h-[320px] flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Operating Dashboard</span>
              <span className="h-2 w-2 rounded-full bg-primary/60" />
            </div>
            <div className="h-px bg-border" />
            <div className="grid grid-cols-2 gap-3">
              {["Projects", "Tasks", "Assets", "Workflows"].map((zone) => (
                <div key={zone} className="bg-secondary/50 rounded p-3">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{zone}</p>
                  <p className="text-lg font-semibold text-foreground mt-1">--</p>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-2">
              <div className="flex-1 bg-primary/10 border border-primary/20 rounded px-3 py-2 text-center">
                <span className="text-xs text-primary font-medium">Define System</span>
              </div>
              <div className="flex-1 bg-secondary/50 border border-border rounded px-3 py-2 text-center">
                <span className="text-xs text-muted-foreground">Track Work</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
            <span className="text-[10px] text-muted-foreground">Status: evolving</span>
            <span className="text-[10px] text-muted-foreground">Heard OS</span>
          </div>
        </div>
      </div>
    </section>
  );
}
