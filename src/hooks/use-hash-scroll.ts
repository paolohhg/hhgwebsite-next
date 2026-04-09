"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function useHashScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [pathname]);
}
