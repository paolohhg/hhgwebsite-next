const steps = ["Define Project", "Assign Owner", "Track Tasks", "Inventory Assets", "Clarify Next Action", "Repeat Weekly"];

export default function HeardOSFlow() {
  return (
    <section id="how-it-works" className="py-16 px-6 border-t border-border">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-10">How The Internal System Works</h2>
        <div className="flex flex-col items-start">
          {steps.map((step, i) => (
            <div key={step} className="flex items-center gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full border border-primary/30 bg-card flex items-center justify-center">
                  <span className="text-xs font-semibold text-primary">{i + 1}</span>
                </div>
                {i < steps.length - 1 && <div className="w-px h-8 bg-border" />}
              </div>
              <span className="text-sm text-foreground font-medium">{step}</span>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-8">The goal is simple: keep work tied to the business function it supports.</p>
      </div>
    </section>
  );
}
