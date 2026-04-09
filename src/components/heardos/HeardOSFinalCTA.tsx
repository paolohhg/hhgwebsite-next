import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function HeardOSFinalCTA() {
  return (
    <section className="py-20 px-6 border-t border-border">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">Start With Control.</h2>
        <p className="text-sm text-muted-foreground mb-8 max-w-lg mx-auto">
          If you can't measure inventory consistently, everything downstream gets noisier.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mb-4">
          <Button size="lg" className="gap-2">
            Launch Heard OS <ArrowRight size={16} />
          </Button>
          <Button variant="outline" size="lg">
            Begin Infrastructure Review
          </Button>
        </div>
        <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Based in Houston, Texas.
        </p>

        <div className="mt-12 text-left max-w-xs mx-auto sm:mx-0 sm:text-center">
          <p className="text-xs text-muted-foreground/70 mb-2">Need direct access?</p>
          <a
            href="mailto:info@heardhospitalitygroup.com"
            className="block text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            info@heardhospitalitygroup.com
          </a>
          <a
            href="tel:+18325108440"
            className="block text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            832-510-8440
          </a>
        </div>
      </div>
    </section>
  );
}
