"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const items = [
  "Catering conversion gaps",
  "Search visibility structure",
  "Follow-up automation",
  "Inventory systems",
  "Operational bottlenecks",
];

export default function AssessmentSection() {
  return (
    <section id="assessment" className="infra-pattern py-20 px-6 border-t border-border">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">Begin Infrastructure Review</h2>
        <p className="text-muted-foreground mb-4 max-w-xl mx-auto">
          Revenue stability requires structure.
        </p>
        <p className="text-muted-foreground mb-10 max-w-xl mx-auto text-sm">
          A structured 30-minute review designed to identify revenue leaks and map the infrastructure required to stabilize cash flow.
        </p>

        <div className="bg-card border border-border rounded-lg p-6 mb-6 text-left max-w-md mx-auto">
          <p className="text-sm font-medium text-foreground mb-4">We review:</p>
          <ul className="space-y-3">
            {items.map((item) => (
              <li key={item} className="flex items-start gap-3 text-secondary-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                <span className="text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-sm text-muted-foreground mb-8 max-w-md mx-auto">
          This is not a strategy call.<br />
          It is a systems assessment.
        </p>

        <Button size="lg" className="gap-2">
          Begin Infrastructure Review <ArrowRight size={16} />
        </Button>
        <p className="text-xs text-muted-foreground mt-4">
          Limited operator capacity per week.<br />Based in Houston, Texas.
        </p>
      </div>
    </section>
  );
}
