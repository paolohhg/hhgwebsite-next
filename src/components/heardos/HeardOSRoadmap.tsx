const milestones = [
  { version: "v1", label: "Inventory Control", status: "Now" },
  { version: "v2", label: "Vendor Intelligence", status: "Next" },
  { version: "v3", label: "Margin Protection", status: "Planned" },
  { version: "v4", label: "Revenue Forecasting", status: "Planned" },
];

export default function HeardOSRoadmap() {
  return (
    <section className="infra-pattern py-16 px-6 border-t border-border">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-10">Roadmap</h2>
        <div className="space-y-4">
          {milestones.map((m, i) => (
            <div key={m.version} className="flex items-center gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`w-3 h-3 rounded-full ${
                    i === 0 ? "bg-primary" : "bg-secondary border border-border"
                  }`}
                />
                {i < milestones.length - 1 && <div className="w-px h-6 bg-border" />}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-foreground">{m.version} — {m.label}</span>
                <span
                  className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded ${
                    i === 0
                      ? "bg-primary/10 text-primary"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {m.status}
                </span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-8">
          Heard OS expands into the full HHG revenue infrastructure platform.
        </p>
      </div>
    </section>
  );
}
