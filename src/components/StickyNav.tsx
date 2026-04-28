"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";

const productItems = [
  { label: "Heard OS", href: "/heard-os" },
  { label: "ContractForge", href: "/contract-forge" },
];

const infraModules = [
  { label: "Catering Revenue Architecture", href: "/#catering" },
  { label: "AI Visibility Architecture", href: "/#ai-search" },
  { label: "Retention Infrastructure", href: "/#reactivation" },
  { label: "Operational Control Layer", href: "/#ops-automation" },
];

const navLinks = [
  { label: "AI Revenue Systems", href: "/ai-revenue-systems" },
  { label: "Consulting", href: "/hospitality-ai-consulting" },
  { label: "About", href: "/about-heard-hospitality-group" },
];

export default function StickyNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const handleNav = (href: string, external?: boolean) => {
    if (external) {
      window.open(href, "_blank", "noopener,noreferrer");
      return;
    }
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

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        (dropdownRef.current && dropdownRef.current.contains(e.target as Node)) ||
        (productsRef.current && productsRef.current.contains(e.target as Node))
      ) return;
      setDropdownOpen("");
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const renderDropdown = (
    label: string,
    items: { label: string; href: string; external?: boolean }[],
    ref: React.RefObject<HTMLDivElement>,
    key: string
  ) => (
    <div ref={ref} className="relative">
      <button
        onClick={() => setDropdownOpen(dropdownOpen === key ? "" : key)}
        className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
      >
        {label} <ChevronDown size={14} className={`transition-transform ${dropdownOpen === key ? "rotate-180" : ""}`} />
      </button>
      {dropdownOpen === key && (
        <div className="absolute top-full mt-2 left-0 w-64 bg-card border border-border rounded-lg py-2 shadow-lg">
          {items.map((m) => (
            <button
              key={m.href}
              onClick={() => { handleNav(m.href, m.external); setDropdownOpen(""); }}
              className="block w-full text-left px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
            >
              {m.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/80 backdrop-blur-md border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Wordmark */}
        <button onClick={() => handleNav("/")} className="text-left shrink-0">
          <span className="block text-foreground font-semibold text-base tracking-[0.08em] uppercase leading-none">
            HEARD
          </span>
          <span className="block h-px w-full bg-primary mt-1" />
          <span className="block text-muted-foreground text-[10px] tracking-[0.2em] uppercase mt-1 font-light">
            Hospitality Group
          </span>
        </button>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-5">
          {renderDropdown("Products", productItems, productsRef, "products")}
          {renderDropdown("Infrastructure", infraModules, dropdownRef, "infra")}

          {navLinks.map((l) => (
            <button
              key={l.href}
              onClick={() => handleNav(l.href)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
            >
              {l.label}
            </button>
          ))}
          <Button size="sm" onClick={() => handleNav("/#assessment")}>
            Contact
          </Button>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-b border-border px-6 pb-4 flex flex-col gap-3">
          <p className="text-xs text-muted-foreground uppercase tracking-wider pt-2">Products</p>
          {productItems.map((m) => (
            <button
              key={m.href}
              onClick={() => { handleNav(m.href); setMobileOpen(false); }}
              className="text-sm text-muted-foreground hover:text-foreground text-left pl-3"
            >
              {m.label}
            </button>
          ))}
          <div className="h-px bg-border my-1" />
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Infrastructure</p>
          {infraModules.map((m) => (
            <button
              key={m.href}
              onClick={() => { handleNav(m.href); setMobileOpen(false); }}
              className="text-sm text-muted-foreground hover:text-foreground text-left pl-3"
            >
              {m.label}
            </button>
          ))}
          <div className="h-px bg-border my-1" />
          {navLinks.map((l) => (
            <button
              key={l.href}
              onClick={() => { handleNav(l.href); setMobileOpen(false); }}
              className="text-sm text-muted-foreground hover:text-foreground text-left"
            >
              {l.label}
            </button>
          ))}
          <Button size="sm" onClick={() => { handleNav("/#assessment"); setMobileOpen(false); }}>
            Contact
          </Button>
        </div>
      )}
    </nav>
  );
}
