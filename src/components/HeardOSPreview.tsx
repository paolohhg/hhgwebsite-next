"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const scrollTo = (id: string) => document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });

const environments = [
  "LASA HTX: owned brand used for system testing",
  "Fit Kitchen Meals: non-owned operational environment where Paolo has involvement",
  "Catering, meal prep, and high-volume kitchen workflow exposure",
  "Third-party delivery, revenue, and margin management context",
];

export default function HeardOSPreview() {
  return (
    <section id="field-tested" className="infra-pattern py-20 px-6 border-t border-border">
      <div className="max-w-5xl mx-auto">
        <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">Operator Context</p>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">Built From Live Operating Environments</h2>
        <p className="text-muted-foreground mb-10 max-w-xl">
          HHG is led by Paolo Nucum, an active hospitality operator building systems against real food-service workflows.
        </p>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div>
            <ul className="space-y-3 mb-8">
              {environments.map((f) => (
                <li key={f} className="flex items-start gap-3 text-secondary-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  <span className="text-sm">{f}</span>
                </li>
              ))}
            </ul>
            <Button onClick={() => scrollTo("#contact")} size="lg" className="gap-2">
              Talk Through a Workflow <ArrowRight size={16} />
            </Button>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 min-h-[260px] flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">System Inputs</span>
                <span className="h-2 w-2 rounded-full bg-primary/60" />
              </div>
              <div className="h-px bg-border" />
              <div className="grid grid-cols-3 gap-3">
                {["Kitchen", "Lead Flow", "Margin"].map((zone) => (
                  <div key={zone} className="bg-secondary/50 rounded p-3">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{zone}</p>
                    <p className="text-lg font-semibold text-foreground mt-1">--</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2 mt-2">
                {[75, 50, 30].map((w, i) => (
                  <div key={i} className="h-2 rounded-full bg-secondary">
                    <div className="h-2 rounded-full bg-primary/30" style={{ width: `${w}%` }} />
                  </div>
                ))}
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground mt-4">Operating context informs product decisions</p>
          </div>
        </div>
      </div>
    </section>
  );
}
