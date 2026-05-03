const productDirection = [
  "ContractForge",
  "Pan Pricer (planned)",
  "Business-in-a-Box Systems",
  "Lead Response Workflows",
];

const workflowLayer = [
  "Contract draft generation",
  "Pricing inputs and yield logic",
  "Forms and automated response",
  "Workflow routing",
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
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-8">The HHG Systems Stack</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <StackColumn title="Product Direction" items={productDirection} />
          <StackColumn title="Workflow Layer" items={workflowLayer} />
        </div>
        <p className="text-muted-foreground text-sm text-center">
          Each layer handles a core business function that operators usually patch together by hand.
        </p>
      </div>
    </section>
  );
}
