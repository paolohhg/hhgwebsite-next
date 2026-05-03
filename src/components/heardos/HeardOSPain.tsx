const bullets = [
  "Projects get tracked in separate notes, messages, and memory.",
  "Tasks lose context when they are not tied to the business system they support.",
  "Sellable assets are hard to manage when products, services, templates, and tools are scattered.",
  "Without structure, operators rebuild the same workflow every time.",
];

export default function HeardOSPain() {
  return (
    <section className="py-16 px-6 border-t border-border">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-8">Why Operating Structure Matters</h2>
        <ul className="space-y-4 mb-8">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-3 text-secondary-foreground">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
              <span className="text-sm">{b}</span>
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted-foreground">Heard OS keeps HHG's work organized around projects, tasks, assets, and workflow systems.</p>
      </div>
    </section>
  );
}
