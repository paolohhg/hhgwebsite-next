"use client";
import { useState, useRef, useCallback } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface BrandConfig {
  logoDataURL: string;
  companyName: string;
  tagline: string;
  accentColor: string;
  addr1: string;
  addr2: string;
  phone: string;
  email: string;
  website: string;
  license: string;
}

interface PartyInfo {
  legalName: string;
  signerName: string;
  title: string;
  email: string;
  address: string;
}

interface TermsConfig {
  startDate: string;
  endDate: string;
  jurisdiction: string;
  fee: string;
  paymentTerms: string;
  scope: string;
  clauses: string[];
  customClauses: string;
}

const CONTRACT_TYPES = [
  { id: "Service Agreement", icon: "⚙", label: "Service Agreement", desc: "Contractor / freelance work" },
  { id: "Non-Disclosure Agreement (NDA)", icon: "🔒", label: "NDA", desc: "Confidentiality" },
  { id: "Catering & Events Agreement", icon: "🍽", label: "Catering", desc: "Events & food service" },
  { id: "Meal Prep & Delivery Agreement", icon: "📦", label: "Meal Prep / Delivery", desc: "Recurring programs" },
  { id: "Consulting Agreement", icon: "💼", label: "Consulting", desc: "Advisory & strategy" },
  { id: "Partnership Agreement", icon: "🤝", label: "Partnership", desc: "Joint ventures" },
];

const AVAILABLE_CLAUSES = [
  "Termination clause (30-day written notice)",
  "Limitation of liability",
  "Confidentiality provisions",
  "Intellectual property / work-for-hire",
  "Non-solicitation (12 months post-term)",
  "Force majeure",
  "Dispute resolution via mediation before litigation",
  "Auto-renewal with 30-day opt-out window",
  "Indemnification",
];

const DEFAULT_ON_CLAUSES = [
  "Termination clause (30-day written notice)",
  "Limitation of liability",
  "Confidentiality provisions",
];

// ── Helpers ───────────────────────────────────────────────────────────────────

const emptyBrand = (): BrandConfig => ({
  logoDataURL: "", companyName: "", tagline: "",
  accentColor: "#0f172a", addr1: "", addr2: "",
  phone: "", email: "", website: "", license: "",
});

const emptyParty = (): PartyInfo => ({
  legalName: "", signerName: "", title: "", email: "", address: "",
});

const emptyTerms = (): TermsConfig => ({
  startDate: new Date().toISOString().split("T")[0],
  endDate: "", jurisdiction: "", fee: "",
  paymentTerms: "Net 30", scope: "",
  clauses: [...DEFAULT_ON_CLAUSES], customClauses: "",
});

// ── Main Component ────────────────────────────────────────────────────────────

export default function ContractForgeApp() {
  const [page, setPage] = useState(1);
  const [brand, setBrand] = useState<BrandConfig>(emptyBrand());
  const [contractType, setContractType] = useState("Service Agreement");
  const [partyA, setPartyA] = useState<PartyInfo>(emptyParty());
  const [partyB, setPartyB] = useState<PartyInfo>(emptyParty());
  const [terms, setTerms] = useState<TermsConfig>(emptyTerms());
  const [generatedHTML, setGeneratedHTML] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const logoInputRef = useRef<HTMLInputElement>(null);

  // ── Navigation ──────────────────────────────────────────────────────────────

  const goTo = (n: number) => {
    if (n === 3 && !partyA.legalName) {
      setPartyA(prev => ({
        ...prev,
        legalName: prev.legalName || brand.companyName,
        email: prev.email || brand.email,
        address: prev.address || [brand.addr1, brand.addr2].filter(Boolean).join(", "),
      }));
    }
    setPage(n);
    window.scrollTo(0, 0);
  };

  // ── Logo Upload ─────────────────────────────────────────────────────────────

  const handleLogo = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setBrand(b => ({ ...b, logoDataURL: ev.target?.result as string }));
    };
    reader.readAsDataURL(file);
  }, []);

  // ── Clause Toggle ───────────────────────────────────────────────────────────

  const toggleClause = (clause: string) => {
    setTerms(t => ({
      ...t,
      clauses: t.clauses.includes(clause)
        ? t.clauses.filter(c => c !== clause)
        : [...t.clauses, clause],
    }));
  };

  // ── Generate ────────────────────────────────────────────────────────────────

  const generate = async () => {
    setIsGenerating(true);
    setError("");
    setGeneratedHTML("");
    goTo(5);

    const aName = partyA.legalName || "Party A";
    const bName = partyB.legalName || "Party B";

    const prompt = `Draft a complete, professional ${contractType} in plain HTML body content only.
Use ONLY these tags: h1, h2, p, strong, and a div class="sig-block" with two div class="sig-party" children.

Contract details:
- Type: ${contractType}
- Party A: ${aName}${partyA.title ? ", " + partyA.title : ""}${partyA.address ? ", " + partyA.address : ""}
- Party A Signatory: ${partyA.signerName || aName}${partyA.title ? ", " + partyA.title : ""}
- Party B: ${bName}${partyB.title ? ", " + partyB.title : ""}${partyB.address ? ", " + partyB.address : ""}
- Party B Signatory: ${partyB.signerName || bName}${partyB.title ? ", " + partyB.title : ""}
- Effective Date: ${terms.startDate}
${terms.endDate ? "- End Date: " + terms.endDate : ""}
- Jurisdiction: ${terms.jurisdiction || "the applicable jurisdiction"}
${terms.fee ? "- Contract Value: " + terms.fee : ""}
${terms.fee ? "- Payment Terms: " + terms.paymentTerms : ""}
${terms.scope ? "- Scope of Work: " + terms.scope : ""}
${terms.clauses.length ? "- Required clauses: " + terms.clauses.join(", ") : ""}
${terms.customClauses ? "- Additional terms: " + terms.customClauses : ""}

Rules:
1. Return ONLY inner HTML — no html/head/body tags, no markdown, no backticks
2. Start with: <h1>${contractType}</h1><p class="doc-meta">Effective ${terms.startDate}</p>
3. Use <h2> for each section
4. Write professional, enforceable legal language
5. End with signature block:
<div class="sig-block">
  <div class="sig-party">
    <p class="sig-lbl">Party A — ${aName}</p>
    <div class="sig-line"></div>
    <p class="sig-nm">${partyA.signerName || aName}</p>
    <p class="sig-tt">${partyA.title || ""}</p>
  </div>
  <div class="sig-party">
    <p class="sig-lbl">Party B — ${bName}</p>
    <div class="sig-line"></div>
    <p class="sig-nm">${partyB.signerName || bName}</p>
    <p class="sig-tt">${partyB.title || ""}</p>
  </div>
</div>`;

    try {
      const res = await fetch("/api/contractforge/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody?.error || `Server error (${res.status})`);
      }
      const data = await res.json();
      let html: string = data?.html || "";
      html = html.replace(/```html/g, "").replace(/```/g, "").trim();
      setGeneratedHTML(html);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(`Generation failed — ${msg}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="pt-28 pb-24">

      {/* Hero */}
      <div className="max-w-4xl mx-auto px-6 mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-medium text-white/50 tracking-wide mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Contract Drafting Tool
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-[1.1] mb-4">
          Contract<span className="text-white/40">Forge</span>
        </h1>
        <p className="text-base sm:text-lg text-white/50 max-w-xl mx-auto leading-relaxed">
          Generate formatted, branded contract drafts from your logo, terms, parties, and clauses. Built for catering, vendor, NDA, and service agreement workflows.
        </p>
      </div>

      {/* Stepper + Content */}
      <div className="max-w-4xl mx-auto px-6">
      <Stepper current={page} />

      {/* Pages */}
      {page === 1 && <PageBrand brand={brand} setBrand={setBrand} logoInputRef={logoInputRef} handleLogo={handleLogo} onNext={() => goTo(2)} />}
      {page === 2 && <PageType contractType={contractType} setContractType={setContractType} onBack={() => goTo(1)} onNext={() => goTo(3)} />}
      {page === 3 && <PageParties partyA={partyA} setPartyA={setPartyA} partyB={partyB} setPartyB={setPartyB} onBack={() => goTo(2)} onNext={() => goTo(4)} />}
      {page === 4 && <PageTerms terms={terms} setTerms={setTerms} onBack={() => goTo(3)} onGenerate={generate} />}
      {page === 5 && (
        <PagePreview
          isGenerating={isGenerating}
          error={error}
          html={generatedHTML}
          brand={brand}
          contractType={contractType}
          partyA={partyA}
          partyB={partyB}
          onBack={() => goTo(4)}
          onReset={() => { setGeneratedHTML(""); setPage(1); }}
        />
      )}
      </div>
    </div>
  );
}

// ── Stepper ───────────────────────────────────────────────────────────────────

function Stepper({ current }: { current: number }) {
  const steps = ["Brand", "Type", "Parties", "Terms", "Generate"];
  return (
    <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 mb-7 gap-1">
      {steps.map((label, i) => {
        const n = i + 1;
        const active = n === current;
        const done = n < current;
        return (
          <div key={n} className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-medium transition-all
            ${active ? "bg-white text-slate-900" : done ? "text-emerald-400" : "text-white/40"}`}>
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0
              ${active ? "bg-slate-900/10" : done ? "bg-emerald-400/15 text-emerald-400" : "bg-white/10"}`}>{n}</span>
            <span className="hidden sm:inline">{label}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── Shared UI ─────────────────────────────────────────────────────────────────

function Card({ children }: { children: React.ReactNode }) {
  return <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-4">{children}</div>;
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-lg font-semibold text-white mb-1">{children}</h2>;
}

function CardSub({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-white/50 mb-5 leading-relaxed">{children}</p>;
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1 block">{children}</label>;
}

function Input({ value, onChange, placeholder, type = "text" }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 focus:bg-white/8 transition-all"
    />
  );
}

function Select({ value, onChange, options }: {
  value: string; onChange: (v: string) => void; options: string[];
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-all"
    >
      {options.map(o => <option key={o} value={o} className="bg-slate-900">{o}</option>)}
    </select>
  );
}

function Textarea({ value, onChange, placeholder, rows = 3 }: {
  value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-all resize-y"
    />
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-5">
      <span className="text-[10px] font-bold uppercase tracking-widest text-white/25">{label}</span>
      <div className="flex-1 h-px bg-white/8" />
    </div>
  );
}

function BtnPrimary({ onClick, children, disabled }: { onClick: () => void; children: React.ReactNode; disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className="px-5 py-2.5 bg-white text-slate-900 rounded-lg text-sm font-semibold hover:bg-white/90 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
      {children}
    </button>
  );
}

function BtnSecondary({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      className="px-5 py-2.5 border border-white/15 text-white/60 rounded-lg text-sm font-medium hover:bg-white/5 hover:text-white transition-all">
      {children}
    </button>
  );
}

function BtnGold({ onClick, children, disabled }: { onClick: () => void; children: React.ReactNode; disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className="flex-1 px-6 py-3 bg-amber-400 text-amber-950 rounded-lg text-sm font-bold hover:bg-amber-300 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
      {children}
    </button>
  );
}

// ── Page 1: Brand ─────────────────────────────────────────────────────────────

function PageBrand({ brand, setBrand, logoInputRef, handleLogo, onNext }: {
  brand: BrandConfig;
  setBrand: React.Dispatch<React.SetStateAction<BrandConfig>>;
  logoInputRef: React.RefObject<HTMLInputElement>;
  handleLogo: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNext: () => void;
}) {
  const set = (key: keyof BrandConfig) => (val: string) => setBrand(b => ({ ...b, [key]: val }));

  return (
    <>
      <Card>
        <CardTitle>Brand identity</CardTitle>
        <CardSub>Your logo and company info appear in every contract header and footer. Set it once — it persists across all contracts you generate.</CardSub>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Logo upload */}
          <div>
            <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogo} className="hidden" />
            <div
              onClick={() => logoInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all
                ${brand.logoDataURL ? "border-emerald-500/40 bg-emerald-500/5" : "border-white/10 hover:border-white/25 bg-white/3"}`}
            >
              {brand.logoDataURL ? (
                <>
                  <img src={brand.logoDataURL} alt="Logo" className="max-h-12 max-w-32 object-contain mx-auto mb-2" />
                  <p className="text-xs text-emerald-400 font-semibold">Logo uploaded ✓</p>
                  <p className="text-[11px] text-white/30 mt-1">Click to replace</p>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-white/8 flex items-center justify-center mx-auto mb-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5">
                      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                    </svg>
                  </div>
                  <p className="text-sm text-white/50 font-medium">Click to upload logo</p>
                  <p className="text-xs text-white/25 mt-1">PNG, SVG, JPG — transparent bg recommended</p>
                </>
              )}
            </div>
            {brand.logoDataURL && (
              <button onClick={() => setBrand(b => ({ ...b, logoDataURL: "" }))}
                className="mt-2 text-xs text-white/30 hover:text-white/60 transition-colors">
                Remove logo
              </button>
            )}
          </div>

          {/* Company basics */}
          <div className="flex flex-col gap-3">
            <div><Label>Company / business name</Label><Input value={brand.companyName} onChange={set("companyName")} placeholder="e.g. Fit Kitchen Meals LLC" /></div>
            <div><Label>Tagline (optional)</Label><Input value={brand.tagline} onChange={set("tagline")} placeholder="e.g. Fresh. Local. Delivered." /></div>
            <div>
              <Label>Header accent color</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={brand.accentColor} onChange={e => set("accentColor")(e.target.value)}
                  className="w-9 h-9 rounded-lg border border-white/10 bg-transparent cursor-pointer p-0.5 flex-shrink-0" />
                <Input value={brand.accentColor} onChange={val => /^#[0-9a-fA-F]{0,6}$/.test(val) && set("accentColor")(val)} placeholder="#0f172a" />
              </div>
            </div>
          </div>
        </div>

        <Divider label="Contact info — footer" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
          <div><Label>Address line 1</Label><Input value={brand.addr1} onChange={set("addr1")} placeholder="1234 Main St" /></div>
          <div><Label>City, State ZIP</Label><Input value={brand.addr2} onChange={set("addr2")} placeholder="Houston, TX 77001" /></div>
          <div><Label>Phone</Label><Input value={brand.phone} onChange={set("phone")} placeholder="(713) 555-0100" /></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div><Label>Email</Label><Input value={brand.email} onChange={set("email")} placeholder="hello@company.com" /></div>
          <div><Label>Website</Label><Input value={brand.website} onChange={set("website")} placeholder="www.company.com" /></div>
          <div><Label>License / Entity # (optional)</Label><Input value={brand.license} onChange={set("license")} placeholder="TX LLC #12345678" /></div>
        </div>

        {/* Live preview */}
        {(brand.companyName || brand.logoDataURL) && (
          <>
            <Divider label="Preview" />
            <div className="flex items-center gap-4 bg-white rounded-xl p-4">
              {brand.logoDataURL
                ? <img src={brand.logoDataURL} alt="logo" className="max-h-10 max-w-24 object-contain flex-shrink-0" />
                : <span className="font-bold text-slate-900 text-lg flex-shrink-0">{brand.companyName}</span>
              }
              {(brand.addr1 || brand.phone) && (
                <div className="text-right ml-auto">
                  <p className="font-semibold text-slate-900 text-sm">{brand.companyName}</p>
                  <p className="text-xs text-slate-500">{[brand.addr1, brand.addr2].filter(Boolean).join(", ")}</p>
                  <p className="text-xs text-slate-500">{[brand.phone, brand.email].filter(Boolean).join(" · ")}</p>
                </div>
              )}
            </div>
          </>
        )}
      </Card>

      <div className="flex gap-3 mt-6">
        <BtnPrimary onClick={onNext}>Continue →</BtnPrimary>
        <span className="text-xs text-white/25 self-center">Brand config reusable across all contracts</span>
      </div>
    </>
  );
}

// ── Page 2: Contract Type ─────────────────────────────────────────────────────

function PageType({ contractType, setContractType, onBack, onNext }: {
  contractType: string; setContractType: (t: string) => void; onBack: () => void; onNext: () => void;
}) {
  return (
    <>
      <Card>
        <CardTitle>Contract type</CardTitle>
        <CardSub>Select the agreement that fits your situation.</CardSub>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {CONTRACT_TYPES.map(ct => (
            <button key={ct.id} onClick={() => setContractType(ct.id)}
              className={`p-4 rounded-xl border text-left transition-all
                ${contractType === ct.id
                  ? "border-white/40 bg-white/10 text-white"
                  : "border-white/8 bg-white/3 text-white/60 hover:border-white/20 hover:text-white/80"}`}
            >
              <span className="text-xl mb-2 block">{ct.icon}</span>
              <span className="text-xs font-semibold block">{ct.label}</span>
              <span className="text-[11px] text-white/35 mt-0.5 block">{ct.desc}</span>
            </button>
          ))}
        </div>
      </Card>
      <div className="flex gap-3 mt-6">
        <BtnSecondary onClick={onBack}>← Back</BtnSecondary>
        <BtnPrimary onClick={onNext}>Continue →</BtnPrimary>
      </div>
    </>
  );
}

// ── Page 3: Parties ───────────────────────────────────────────────────────────

function PartyForm({ label, badge, party, setParty }: {
  label: string; badge: string; party: PartyInfo; setParty: React.Dispatch<React.SetStateAction<PartyInfo>>;
}) {
  const set = (key: keyof PartyInfo) => (val: string) => setParty(p => ({ ...p, [key]: val }));
  return (
    <div className="border border-white/8 bg-white/3 rounded-xl p-5 mb-3">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">{label}</span>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badge === "A" ? "bg-white/10 text-white/70" : "bg-amber-400/15 text-amber-300"}`}>
          Party {badge}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div><Label>Full legal / business name</Label><Input value={party.legalName} onChange={set("legalName")} placeholder="e.g. Acme LLC" /></div>
        <div><Label>Signatory name</Label><Input value={party.signerName} onChange={set("signerName")} placeholder="e.g. Jane Doe" /></div>
        <div><Label>Title / role</Label><Input value={party.title} onChange={set("title")} placeholder="e.g. Owner, GM" /></div>
        <div><Label>Email</Label><Input value={party.email} onChange={set("email")} placeholder="" type="email" /></div>
        <div className="sm:col-span-2"><Label>Address</Label><Input value={party.address} onChange={set("address")} placeholder="Street, City, State ZIP" /></div>
      </div>
    </div>
  );
}

function PageParties({ partyA, setPartyA, partyB, setPartyB, onBack, onNext }: {
  partyA: PartyInfo; setPartyA: React.Dispatch<React.SetStateAction<PartyInfo>>;
  partyB: PartyInfo; setPartyB: React.Dispatch<React.SetStateAction<PartyInfo>>;
  onBack: () => void; onNext: () => void;
}) {
  return (
    <>
      <Card>
        <CardTitle>Parties to the agreement</CardTitle>
        <CardSub>Party A is typically your business — pre-filled from brand settings if you completed step 1.</CardSub>
        <PartyForm label="Service Provider" badge="A" party={partyA} setParty={setPartyA} />
        <PartyForm label="Client / Counter-Party" badge="B" party={partyB} setParty={setPartyB} />
      </Card>
      <div className="flex gap-3 mt-6">
        <BtnSecondary onClick={onBack}>← Back</BtnSecondary>
        <BtnPrimary onClick={onNext}>Continue →</BtnPrimary>
      </div>
    </>
  );
}

// ── Page 4: Terms ─────────────────────────────────────────────────────────────

function PageTerms({ terms, setTerms, onBack, onGenerate }: {
  terms: TermsConfig; setTerms: React.Dispatch<React.SetStateAction<TermsConfig>>;
  onBack: () => void; onGenerate: () => void;
}) {
  const set = (key: keyof TermsConfig) => (val: string) => setTerms(t => ({ ...t, [key]: val }));

  return (
    <>
      <Card>
        <CardTitle>Contract terms</CardTitle>
        <CardSub>Fill in your specifics — Claude writes professional legal language around them.</CardSub>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div><Label>Effective date</Label><Input type="date" value={terms.startDate} onChange={set("startDate")} /></div>
          <div><Label>End / expiration date</Label><Input type="date" value={terms.endDate} onChange={set("endDate")} /></div>
          <div><Label>Governing jurisdiction</Label><Input value={terms.jurisdiction} onChange={set("jurisdiction")} placeholder="e.g. Texas" /></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div><Label>Contract value / fee</Label><Input value={terms.fee} onChange={set("fee")} placeholder="e.g. $4,500/mo or $18,000 flat" /></div>
          <div>
            <Label>Payment terms</Label>
            <Select value={terms.paymentTerms} onChange={set("paymentTerms")} options={["Net 7","Net 14","Net 30","50% upfront, 50% on completion","Monthly retainer","Upon delivery","Custom (describe below)"]} />
          </div>
        </div>

        <div className="mb-4">
          <Label>Scope of work / description of services</Label>
          <Textarea value={terms.scope} onChange={set("scope")} rows={4} placeholder="Deliverables, schedule, service specifics, or special conditions..." />
        </div>

        <Divider label="Clauses to include" />

        <div className="flex flex-wrap gap-2 mb-4">
          {AVAILABLE_CLAUSES.map(clause => (
            <button key={clause} onClick={() => {
              setTerms(t => ({
                ...t,
                clauses: t.clauses.includes(clause)
                  ? t.clauses.filter(c => c !== clause)
                  : [...t.clauses, clause],
              }));
            }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all
                ${terms.clauses.includes(clause)
                  ? "border-white/30 bg-white/10 text-white"
                  : "border-white/8 text-white/40 hover:border-white/20 hover:text-white/60"}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${terms.clauses.includes(clause) ? "bg-white/60" : "bg-white/15"}`} />
              {clause.split("(")[0].trim()}
            </button>
          ))}
        </div>

        <div>
          <Label>Additional / custom clauses (optional)</Label>
          <Textarea value={terms.customClauses} onChange={set("customClauses")} placeholder="Industry-specific language, special requirements, or custom provisions..." />
        </div>
      </Card>

      <div className="flex gap-3 mt-6">
        <BtnSecondary onClick={onBack}>← Back</BtnSecondary>
        <BtnGold onClick={onGenerate}>Generate Contract with AI ✦</BtnGold>
      </div>
    </>
  );
}

// ── Page 5: Preview ───────────────────────────────────────────────────────────

function PagePreview({ isGenerating, error, html, brand, contractType, partyA, partyB, onBack, onReset }: {
  isGenerating: boolean; error: string; html: string;
  brand: BrandConfig; contractType: string;
  partyA: PartyInfo; partyB: PartyInfo;
  onBack: () => void; onReset: () => void;
}) {
  if (isGenerating) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-xl p-16 text-center">
        <div className="w-16 h-16 border-2 border-white/20 rounded-full mx-auto mb-6 relative" style={{ animation: "spin 2s linear infinite" }}>
          <div className="absolute inset-2 rounded-full bg-white/10" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Drafting your contract…</h3>
        <p className="text-sm text-white/40">Claude is writing professional legal language tailored to your terms.</p>
        <div className="w-48 h-0.5 bg-white/8 rounded mx-auto mt-6 overflow-hidden">
          <div className="h-full bg-amber-400 rounded" style={{ animation: "progress 3.5s ease-out forwards", width: "0%" }} />
        </div>
        <style>{`
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes progress { from { width: 0%; } to { width: 80%; } }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/8 border border-red-500/20 rounded-xl p-8 text-center">
        <p className="text-red-400 font-medium mb-4">{error}</p>
        <BtnSecondary onClick={onBack}>← Go Back</BtnSecondary>
      </div>
    );
  }

  const headerBorderColor = brand.accentColor || "#0f172a";

  return (
    <>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h2 className="text-lg font-semibold text-white">Contract preview</h2>
        <div className="flex gap-2">
          <BtnSecondary onClick={onBack}>← Edit Terms</BtnSecondary>
          <BtnSecondary onClick={onReset}>New Contract</BtnSecondary>
          <BtnPrimary onClick={() => window.print()}>Download PDF</BtnPrimary>
        </div>
      </div>

      {/* Contract document */}
      <div className="bg-white rounded-xl overflow-hidden border border-white/10 max-h-[680px] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between p-7 pb-5" style={{ borderBottom: `3px solid ${headerBorderColor}` }}>
          <div>
            {brand.logoDataURL
              ? <img src={brand.logoDataURL} alt={brand.companyName} className="max-h-11 max-w-36 object-contain" />
              : <span className="text-xl font-bold text-slate-900">{brand.companyName || "Your Company"}</span>
            }
          </div>
          {brand.companyName && (
            <div className="text-right text-xs text-slate-500 leading-6">
              {brand.companyName && <strong className="block text-sm text-slate-900 font-semibold">{brand.companyName}</strong>}
              {brand.tagline && <span className="block">{brand.tagline}</span>}
              {brand.addr1 && <span className="block">{brand.addr1}</span>}
              {brand.addr2 && <span className="block">{brand.addr2}</span>}
              {(brand.phone || brand.email) && <span className="block">{[brand.phone, brand.email].filter(Boolean).join(" · ")}</span>}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="px-8 py-6 contract-body" dangerouslySetInnerHTML={{ __html: html }} />

        {/* Footer */}
        <div className="flex items-center justify-between px-7 py-3 border-t border-slate-100 bg-slate-50 text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            {brand.logoDataURL && <img src={brand.logoDataURL} alt="" className="max-h-4 max-w-14 object-contain opacity-50" />}
            {brand.companyName && <span>{brand.companyName}</span>}
            {brand.website && <span>· {brand.website}</span>}
            {brand.phone && <span>· {brand.phone}</span>}
            {brand.license && <span>· Lic. {brand.license}</span>}
          </div>
          <span>Confidential · Page 1 of 1</span>
        </div>
      </div>

      {/* Contract body styles */}
      <style>{`
        .contract-body h1 { font-size: 20px; text-align: center; font-weight: 600; color: #0f172a; margin-bottom: 4px; }
        .contract-body .doc-meta { text-align: center; font-size: 12px; color: #64748b; margin-bottom: 24px; }
        .contract-body h2 { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #0f172a; margin: 20px 0 6px; padding-bottom: 4px; border-bottom: 1px solid #e2e8f0; }
        .contract-body p { font-size: 13px; color: #1e293b; margin-bottom: 10px; line-height: 1.75; }
        .contract-body .sig-block { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; }
        .contract-body .sig-lbl { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #94a3b8; margin-bottom: 28px; }
        .contract-body .sig-line { border-bottom: 1px solid #cbd5e1; margin-bottom: 8px; height: 36px; }
        .contract-body .sig-nm { font-size: 13px; font-weight: 600; color: #0f172a; margin: 0; }
        .contract-body .sig-tt { font-size: 11px; color: #64748b; margin: 0; }
      `}</style>
    </>
  );
}
