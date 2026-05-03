const features = [
  { title: "Project Tracking", desc: "Track HHG initiatives across brands, owners, status, and next action." },
  { title: "Task Management", desc: "Tie work back to the project or system it supports." },
  { title: "Asset Inventory", desc: "Keep products, services, content, templates, and tools visible." },
  { title: "Operator Context", desc: "Organize work around real food-service workflows, not generic software categories." },
  { title: "Private Dashboard", desc: "Internal access for Paolo and Mel through magic-link auth and allowlist controls." },
  { title: "Product Direction", desc: "Future public workflow products can inherit structure from the internal system." },
];

export default function HeardOSFeatures() {
  return (
    <section className="infra-pattern py-16 px-6 border-t border-border">
      <div className="max-w-5xl mx-auto">
        <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">Core Structure</p>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-10">What Heard OS Organizes</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <div key={f.title} className="bg-card border border-border rounded-lg p-5 hover:border-primary/30 transition-colors">
              <h3 className="text-sm font-semibold text-foreground mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
