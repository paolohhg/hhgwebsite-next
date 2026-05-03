"use server";

import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

function isAllowed(email: string) {
  const allowlist = (process.env.ALLOWED_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return allowlist.includes(email.toLowerCase());
}

function getRequestOrigin(h: Headers) {
  const forwardedHost = h.get("x-forwarded-host");
  const host = forwardedHost || h.get("host");
  if (!host) return "";

  const forwardedProto = h.get("x-forwarded-proto");
  const isLocalhost = host.startsWith("localhost") || host.startsWith("127.0.0.1");
  const proto = forwardedProto || (isLocalhost ? "http" : "https");

  return `${proto}://${host}`;
}

export async function sendMagicLink(formData: FormData) {
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();

  if (!email || !isAllowed(email)) {
    // Don't reveal which addresses are authorized; show the same "sent" state.
    redirect("/os/login?sent=1");
  }

  const supabase = await createClient();
  const h = await headers();
  const origin = getRequestOrigin(h);

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/os/auth/callback`,
      shouldCreateUser: true,
    },
  });

  if (error) {
    redirect("/os/login?error=auth_failed");
  }

  redirect("/os/login?sent=1");
}
