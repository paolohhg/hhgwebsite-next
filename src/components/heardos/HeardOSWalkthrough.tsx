export default function HeardOSWalkthrough() {
  return (
    <section className="infra-pattern py-16 px-6 border-t border-border">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-10">What You'll See</h2>
        <div className="space-y-8">
          {/* Mock 1: Zones Screen */}
          <div>
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Zones</span>
                <span className="h-2 w-2 rounded-full bg-primary/60" />
              </div>
              <div className="h-px bg-border mb-4" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {["Walk-In", "Dry Storage", "Freezer", "Bar"].map((z) => (
                  <div key={z} className="bg-secondary/50 rounded p-3 text-center">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{z}</p>
                  </div>
                ))}
              </div>
              <div className="bg-primary/10 border border-primary/20 rounded px-4 py-2 text-center w-fit">
                <span className="text-xs text-primary font-medium">Start Count</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Select a zone to begin counting.</p>
          </div>

          {/* Mock 2: Count Screen */}
          <div>
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Walk-In — Count</span>
                <span className="text-[10px] text-muted-foreground">12 items</span>
              </div>
              <div className="h-px bg-border mb-4" />
              <div className="space-y-2 mb-4">
                {[
                  { name: "Chicken Breast", qty: "24" },
                  { name: "Heavy Cream", qty: "6" },
                  { name: "Mixed Greens", qty: "—" },
                ].map((item) => (
                  <div key={item.name} className="flex items-center justify-between bg-secondary/30 rounded px-3 py-2">
                    <span className="text-sm text-foreground">{item.name}</span>
                    <div className="bg-secondary/50 border border-border rounded w-12 h-7 flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">{item.qty}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex-1 bg-secondary/30 border border-border rounded px-3 py-2">
                  <span className="text-xs text-muted-foreground">Quick add / search…</span>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="bg-primary/10 border border-primary/20 rounded px-4 py-2">
                  <span className="text-xs text-primary font-medium">Finish Count</span>
                </div>
                <div className="bg-secondary/50 border border-border rounded px-4 py-2">
                  <span className="text-xs text-muted-foreground">Export CSV</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Count items, save progress, and export when complete.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
