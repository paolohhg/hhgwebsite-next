import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { isAllowedOsEmail } from "@/lib/os/users";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const requestedNext = searchParams.get("next");
  const next = requestedNext === "/os/password" ? requestedNext : "/os";

  if (!code) {
    return NextResponse.redirect(`${origin}/os/login?error=auth_failed`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(`${origin}/os/login?error=auth_failed`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email || !isAllowedOsEmail(user.email)) {
    await supabase.auth.signOut();
    return NextResponse.redirect(`${origin}/os/login?error=not_allowed`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
