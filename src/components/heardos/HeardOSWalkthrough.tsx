export default function HeardOSWalkthrough() {
  return (
    <section className="infra-pattern py-16 px-6 border-t border-border">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-10">What The Internal View Tracks</h2>
        <div className="space-y-8">
          <div>
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Projects</span>
                <span className="h-2 w-2 rounded-full bg-primary/60" />
              </div>
              <div className="h-px bg-border mb-4" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {["HHG", "LASA", "ContractForge", "Fit Kitchen"].map((z) => (
                  <div key={z} className="bg-secondary/50 rounded p-3 text-center">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{z}</p>
                  </div>
                ))}
              </div>
              <div className="bg-primary/10 border border-primary/20 rounded px-4 py-2 text-center w-fit">
                <span className="text-xs text-primary font-medium">Define Next Action</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Projects stay attached to brand, owner, status, and next action.</p>
          </div>

          <div>
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Assets + Tasks</span>
                <span className="text-[10px] text-muted-foreground">Operator view</span>
              </div>
              <div className="h-px bg-border mb-4" />
              <div className="space-y-2 mb-4">
                {[
                  { name: "ContractForge", qty: "live" },
                  { name: "Pan Pricer", qty: "planned" },
                  { name: "Business-in-a-Box", qty: "direction" },
                ].map((item) => (
                  <div key={item.name} className="flex items-center justify-between bg-secondary/30 rounded px-3 py-2">
                    <span className="text-sm text-foreground">{item.name}</span>
                    <div className="bg-secondary/50 border border-border rounded min-w-16 h-7 px-2 flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">{item.qty}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <div className="bg-primary/10 border border-primary/20 rounded px-4 py-2">
                  <span className="text-xs text-primary font-medium">Prioritize</span>
                </div>
                <div className="bg-secondary/50 border border-border rounded px-4 py-2">
                  <span className="text-xs text-muted-foreground">Review Weekly</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">The internal dashboard is not linked publicly; this page describes the system direction.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
