"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const scrollTo = (id: string) => document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });

interface AnchorSectionProps {
  id: string;
  title: string;
  description: string;
  bullets: string[];
}

export default function AnchorSection({ id, title, description, bullets }: AnchorSectionProps) {
  return (
    <section id={id} className="infra-pattern py-20 px-6 border-t border-border">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">{title}</h2>
        <p className="text-muted-foreground mb-8 max-w-xl">{description}</p>
        <ul className="space-y-3 mb-10">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-3 text-secondary-foreground">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
              <span className="text-sm">{b}</span>
            </li>
          ))}
        </ul>
        <Button onClick={() => scrollTo("#assessment")} size="lg" className="gap-2">
          Review Your System Gaps <ArrowRight size={16} />
        </Button>
      </div>
    </section>
  );
}
