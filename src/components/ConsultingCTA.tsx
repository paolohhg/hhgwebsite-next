"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function ConsultingCTA() {
  return (
    <div className="rounded-lg border border-primary/30 bg-card p-8 text-center mb-16">
      <h2 className="text-2xl font-bold mb-3">Need a workflow cleaned up?</h2>
      <p className="text-muted-foreground mb-6">Send the friction point and HHG will point you toward the right system conversation.</p>
      <Button size="lg" className="gap-2" onClick={() => {
        const el = document.querySelector("#contact") || document.querySelector("#assessment");
        if (el) el.scrollIntoView({ behavior: "smooth" });
        else window.location.href = "/#contact";
      }}>
        Contact HHG <ArrowRight size={16} />
      </Button>
    </div>
  );
}
