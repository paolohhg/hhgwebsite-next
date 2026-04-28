"use client";

import { useRouter, usePathname } from "next/navigation";

const links = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about-heard-hospitality-group" },
  { label: "AI Revenue Systems", href: "/ai-revenue-systems" },
  { label: "Consulting", href: "/hospitality-ai-consulting" },
  { label: "Heard OS", href: "/heard-os" },
  { label: "ContractForge", href: "/contract-forge" },
  { label: "Contact", href: "/#assessment" },
];

export default function Footer() {
  const router = useRouter();
  const pathname = usePathname();

  const handleNav = (href: string) => {
    if (href.startsWith("/#")) {
      const hash = href.slice(1);
      if (pathname === "/") {
        document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
      } else {
        router.push("/" + hash);
      }
    } else {
      router.push(href);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="border-t border-border py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <span className="block text-foreground font-semibold text-sm tracking-[0.08em] uppercase leading-none">
            HEARD
          </span>
          <span className="block h-px w-10 bg-primary mt-1" />
          <span className="block text-muted-foreground text-[10px] tracking-[0.2em] uppercase mt-1 font-light">
            Hospitality Group
          </span>
        </div>
        <p className="text-sm text-muted-foreground mb-6">AI-Powered Revenue Infrastructure for Hospitality Businesses.</p>
        <div className="flex flex-wrap gap-4 mb-8">
          {links.map((l) => (
            <button
              key={l.href}
              onClick={() => handleNav(l.href)}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {l.label}
            </button>
          ))}
        </div>
        {/* Contact block */}
        <div className="mb-8">
          <span className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70 mb-3">
            Contact
          </span>
          <a
            href="mailto:info@heardhospitalitygroup.com"
            className="block text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            info@heardhospitalitygroup.com
          </a>
          <a
            href="tel:+18325108440"
            className="block text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            832-510-8440
          </a>
          <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground/50 mt-3">
            Independent Infrastructure Operator · Based in Houston, Texas
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between text-xs text-muted-foreground border-t border-border pt-6">
          <span>Based in Houston, Texas</span>
          <span>© 2026 Heard Hospitality Group</span>
        </div>
      </div>
    </footer>
  );
}
