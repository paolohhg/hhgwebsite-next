import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Starter",
    features: ["One location", "Up to 3 zones", "Exports"],
    cta: "Start Starter",
    primary: false,
  },
  {
    name: "Pro",
    features: ["Multi-user", "Unlimited zones", "Templates by concept", "Priority support"],
    cta: "Start Pro",
    primary: true,
  },
  {
    name: "Infrastructure",
    features: ["Includes HHG install", "Data layer + automation integration"],
    cta: "Begin Infrastructure Review",
    primary: false,
  },
];

export default function HeardOSPricing() {
  return (
    <section className="py-16 px-6 border-t border-border">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-10">Pricing</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`bg-card border rounded-lg p-6 flex flex-col ${
                p.primary ? "border-primary/40" : "border-border"
              }`}
            >
              <h3 className="text-lg font-semibold text-foreground mb-4">{p.name}</h3>
              <ul className="space-y-2 mb-6 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-secondary-foreground">
                    <span className="mt-1.5 h-1 w-1 rounded-full bg-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button variant={p.primary ? "default" : "outline"} className="w-full">
                {p.cta}
              </Button>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-6">Pricing subject to change during early rollout.</p>
      </div>
    </section>
  );
}
