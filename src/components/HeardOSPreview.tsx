"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const scrollTo = (id: string) => document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });

const features = [
  "Zone-based count tracking",
  "Par level visibility",
  "Count history + exports",
  "Multi-user control (Pro)",
];

export default function HeardOSPreview() {
  return (
    <section id="heard-os" className="infra-pattern py-20 px-6 border-t border-border">
      <div className="max-w-5xl mx-auto">
        <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">System Foundation</p>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">Heard OS v1 — Inventory Control</h2>
        <p className="text-muted-foreground mb-10 max-w-xl">
          The control layer for independent operators.
        </p>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div>
            <ul className="space-y-3 mb-8">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-secondary-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  <span className="text-sm">{f}</span>
                </li>
              ))}
            </ul>
            <Button onClick={() => scrollTo("#heard-os")} size="lg" className="gap-2">
              View Heard OS <ArrowRight size={16} />
            </Button>
          </div>

          {/* Dashboard placeholder frame */}
          <div className="bg-card border border-border rounded-lg p-6 min-h-[260px] flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Inventory Dashboard</span>
                <span className="h-2 w-2 rounded-full bg-primary/60" />
              </div>
              <div className="h-px bg-border" />
              <div className="grid grid-cols-3 gap-3">
                {["Walk-in", "Dry Storage", "Bar"].map((zone) => (
                  <div key={zone} className="bg-secondary/50 rounded p-3">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{zone}</p>
                    <p className="text-lg font-semibold text-foreground mt-1">—</p>
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
            <p className="text-[10px] text-muted-foreground mt-4">Heard OS v1.0</p>
          </div>
        </div>
      </div>
    </section>
  );
}
