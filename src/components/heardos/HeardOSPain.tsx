const bullets = [
  "Counts happen across multiple zones, not one clipboard.",
  "Paper lists get lost, outdated, or inconsistent between staff.",
  "No count history means no visibility.",
  "Without structure, ordering becomes guessing.",
];

export default function HeardOSPain() {
  return (
    <section className="py-16 px-6 border-t border-border">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-8">Why Inventory Breaks First</h2>
        <ul className="space-y-4 mb-8">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-3 text-secondary-foreground">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
              <span className="text-sm">{b}</span>
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted-foreground">Heard OS installs a repeatable counting system.</p>
      </div>
    </section>
  );
}
