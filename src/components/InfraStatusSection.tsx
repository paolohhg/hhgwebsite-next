const rows = [
  "Contracts rebuilt from old files instead of generated from a standard intake",
  "Catering pricing based on guesses instead of cost, yield, and margin structure",
  "Leads sitting in inboxes without a defined response sequence",
  "Launch work split across websites, forms, automations, and vendors",
  "Manual workflows that depend on memory instead of repeatable systems",
];

export default function InfraStatusSection() {
  return (
    <section className="infra-pattern py-20 px-6 border-t border-border">
      <div className="max-w-4xl mx-auto">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">Operator Friction Points</p>
        <div className="bg-card border border-border rounded-lg divide-y divide-border">
          {rows.map((row, i) => (
            <div key={i} className="flex items-start gap-4 px-6 py-4">
              <span className="mt-1 h-2 w-2 rounded-full bg-destructive/70 shrink-0" />
              <span className="text-sm text-secondary-foreground">{row}</span>
            </div>
          ))}
        </div>
        <p className="text-muted-foreground text-sm mt-8">
          If core business functions live across memory, spreadsheets, inboxes, and disconnected tools, the system is doing too much work by hand.
        </p>
      </div>
    </section>
  );
}
