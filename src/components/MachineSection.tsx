const steps = ["Traffic", "Structured Funnel", "CRM & Data Capture", "Automation", "Retention Loop", "Repeat Revenue"];

export default function MachineSection() {
  return (
    <section className="infra-pattern py-20 px-6 border-t border-border">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-12">How The Machine Works</h2>
        <div className="flex flex-col items-center gap-0">
          {steps.map((step, i) => (
            <div key={step} className="flex flex-col items-center">
              <div className="bg-card border border-border rounded-lg px-8 py-4 text-sm font-medium text-foreground w-64">
                {step}
              </div>
              {i < steps.length - 1 && <div className="w-px h-6 bg-primary/30" />}
            </div>
          ))}
        </div>
        <p className="text-muted-foreground text-sm mt-10">When systems connect, instability decreases.</p>
      </div>
    </section>
  );
}
