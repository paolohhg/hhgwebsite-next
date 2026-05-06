"use server";

import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { isAllowedOsEmail } from "@/lib/os/users";

export async function sendMagicLink(formData: FormData) {
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();

  if (!email || !isAllowedOsEmail(email)) {
    // Don't reveal which addresses are authorized; show the same "sent" state.
    redirect("/os/login?sent=1");
  }

  if (!getSupabaseConfig()) {
    redirect("/os/login?error=config");
  }

  const supabase = await createClient();
  const h = await headers();
  const host = h.get("host");
  const proto = h.get("x-forwarded-proto") || "https";
  const origin = host ? `${proto}://${host}` : "";

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
