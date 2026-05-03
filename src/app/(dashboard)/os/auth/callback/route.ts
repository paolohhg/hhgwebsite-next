import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = "/os";

  if (!code) {
    return NextResponse.redirect(`${origin}/os/login?error=auth_failed`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    console.error("[hhg-os-auth-callback]", error.message);
    return NextResponse.redirect(`${origin}/os/login?error=auth_failed`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const allowlist = (process.env.ALLOWED_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (!user?.email || !allowlist.includes(user.email.toLowerCase())) {
    await supabase.auth.signOut();
    return NextResponse.redirect(`${origin}/os/login?error=unauthorized`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
