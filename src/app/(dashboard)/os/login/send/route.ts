import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

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

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const origin = new URL(request.url).origin;

  if (!email || !isAllowed(email)) {
    return NextResponse.redirect(`${origin}/os/login?sent=1`, 303);
  }

  const supabase = await createClient();
  const h = await headers();
  const redirectOrigin = getRequestOrigin(h);
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${redirectOrigin}/os/auth/callback`,
      shouldCreateUser: true,
    },
  });

  if (error) {
    console.error("[hhg-os-login]", error.message);
    return NextResponse.redirect(`${origin}/os/login?error=auth_failed`, 303);
  }

  return NextResponse.redirect(`${origin}/os/login?sent=1`, 303);
}
