const bullets = [
  "Catering inquiries without structured follow-up",
  "Visibility gaps in AI-driven search",
  "Manual inventory tracking",
  "No automated guest retention loop",
  "Revenue decisions without backend data",
];

export default function InstabilitySection() {
  return (
    <section className="infra-pattern py-20 px-6 border-t border-border">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">Where Instability Begins</h2>
        <p className="text-muted-foreground mb-8">
          Revenue instability is structural.
        </p>
        <ul className="space-y-3 mb-8">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-3 text-secondary-foreground">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
              <span className="text-sm">{b}</span>
            </li>
          ))}
        </ul>
        <p className="text-muted-foreground text-sm">Revenue stability requires infrastructure.</p>
      </div>
    </section>
  );
}
