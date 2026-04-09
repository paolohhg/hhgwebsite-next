const features = [
  { title: "Zone-Based Count Tracking", desc: "Assign items to storage zones so counts match real movement." },
  { title: "Par Level Visibility", desc: "Set pars per item and see what must be ordered." },
  { title: "Count History + Exports", desc: "Track count dates and export CSV for vendors, spreadsheets, or accounting." },
  { title: "Multi-User Control (Pro)", desc: "Multiple counters, controlled permissions, one source of truth." },
  { title: "Fast Mobile UI", desc: "Designed for phone-in-hand counting." },
  { title: "Templates by Concept", desc: "Save layouts per concept/location (Pro)." },
];

export default function HeardOSFeatures() {
  return (
    <section className="infra-pattern py-16 px-6 border-t border-border">
      <div className="max-w-5xl mx-auto">
        <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">Core Features</p>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-10">What v1 Includes</h2>
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
