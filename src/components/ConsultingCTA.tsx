"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function ConsultingCTA() {
  return (
    <div className="rounded-lg border border-primary/30 bg-card p-8 text-center mb-16">
      <h2 className="text-2xl font-bold mb-3">Ready to stabilize your revenue?</h2>
      <p className="text-muted-foreground mb-6">Book a strategy call and we'll map your infrastructure gaps.</p>
      <Button size="lg" className="gap-2" onClick={() => {
        const el = document.querySelector("#contact") || document.querySelector("#assessment");
        if (el) el.scrollIntoView({ behavior: "smooth" });
        else window.location.href = "/#assessment";
      }}>
        Book a Strategy Call <ArrowRight size={16} />
      </Button>
    </div>
  );
}
