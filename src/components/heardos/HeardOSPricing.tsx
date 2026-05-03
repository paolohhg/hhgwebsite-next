import { Button } from "@/components/ui/button";

const tracks = [
  {
    name: "Internal OS",
    features: ["Projects", "Tasks", "Assets"],
    cta: "Private HHG Use",
    primary: false,
  },
  {
    name: "Workflow Products",
    features: ["ContractForge", "Pan Pricer planned", "Business-in-a-Box under development"],
    cta: "View Systems",
    primary: true,
  },
  {
    name: "Operator Install",
    features: ["Workflow review", "Forms and response logic", "System handoff"],
    cta: "Contact HHG",
    primary: false,
  },
];

export default function HeardOSPricing() {
  return (
    <section className="py-16 px-6 border-t border-border">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-10">Current Tracks</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {tracks.map((p) => (
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
        <p className="text-xs text-muted-foreground mt-6">This is directional positioning, not published product pricing.</p>
      </div>
    </section>
  );
}
