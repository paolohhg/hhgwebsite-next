const rows = [
  "Catering inquiries sitting in inboxes without defined follow-up sequence",
  "Inventory counts tracked on paper across multiple storage zones",
  "Guest data spread across disconnected tools",
  "Manual proposal + deposit workflows",
  "No structured retention loop",
];

export default function InfraStatusSection() {
  return (
    <section className="infra-pattern py-20 px-6 border-t border-border">
      <div className="max-w-4xl mx-auto">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">Infrastructure Status</p>
        <div className="bg-card border border-border rounded-lg divide-y divide-border">
          {rows.map((row, i) => (
            <div key={i} className="flex items-start gap-4 px-6 py-4">
              <span className="mt-1 h-2 w-2 rounded-full bg-destructive/70 shrink-0" />
              <span className="text-sm text-secondary-foreground">{row}</span>
            </div>
          ))}
        </div>
        <p className="text-muted-foreground text-sm mt-8">
          If you are relying on memory, spreadsheets, or scattered tools — your infrastructure is incomplete.
        </p>
      </div>
    </section>
  );
}
