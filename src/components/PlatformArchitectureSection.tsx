const layers = [
  "Operator Intake",
  "Structured Data",
  "Automation",
  "Documents + Pricing",
  "Lead Response",
];

export default function PlatformArchitectureSection() {
  return (
    <section className="infra-pattern py-20 px-6 border-t border-border">
      <div className="max-w-2xl mx-auto">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-8 text-center">Workflow Architecture</p>
        <div className="flex flex-col items-center gap-0">
          {layers.map((layer, i) => (
            <div key={layer} className="flex flex-col items-center">
              <div className="bg-card border border-border rounded-lg px-10 py-4 text-sm font-medium text-foreground w-64 text-center">
                {layer}
              </div>
              {i < layers.length - 1 && (
                <div className="w-px h-6 bg-primary/30" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
