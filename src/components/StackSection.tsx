const hospitality = [
  "Catering Revenue Architecture",
  "Retention Infrastructure",
  "Website Revenue Optimization",
  "Operations Automation",
];

const ai = [
  "AI SEO + Schema Implementation",
  "Structured Data Architecture",
  "Search Visibility Optimization",
  "Automated Revenue Workflows",
];

function StackColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="font-semibold mb-4 text-foreground text-sm uppercase tracking-wider">{title}</h3>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-sm text-secondary-foreground">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function StackSection() {
  return (
    <section className="infra-pattern py-20 px-6 border-t border-border">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-8">The Revenue Infrastructure Stack</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <StackColumn title="Hospitality Stack" items={hospitality} />
          <StackColumn title="AI Stack" items={ai} />
        </div>
        <p className="text-muted-foreground text-sm text-center">
          Each layer connects. Each layer reinforces the next.
        </p>
      </div>
    </section>
  );
}
