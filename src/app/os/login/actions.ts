"use server";

import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { isAllowedOsEmail } from "@/lib/os/users";

function getEmail(formData: FormData) {
  return String(formData.get("email") || "")
    .trim()
    .toLowerCase();
}

function getPassword(formData: FormData) {
  return String(formData.get("password") || "");
}

async function getOrigin() {
  const h = await headers();
  const host = h.get("host");
  const proto = h.get("x-forwarded-proto") || "https";
  return host ? `${proto}://${host}` : "";
}

export async function signInWithPassword(formData: FormData) {
  const email = getEmail(formData);
  const password = getPassword(formData);

  if (!email || !password || !isAllowedOsEmail(email)) {
    redirect("/os/login?error=auth_failed");
  }

  if (!getSupabaseConfig()) {
    redirect("/os/login?error=config");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect("/os/login?error=auth_failed");
  }

  redirect("/os");
}

export async function setUpPassword(formData: FormData) {
  const email = getEmail(formData);
  const password = getPassword(formData);
  const confirmPassword = String(formData.get("confirm_password") || "");

  if (!email || !isAllowedOsEmail(email)) {
    redirect("/os/login?mode=setup&error=not_allowed");
  }

  if (password.length < 8) {
    redirect("/os/login?mode=setup&error=password_short");
  }

  if (password !== confirmPassword) {
    redirect("/os/login?mode=setup&error=password_mismatch");
  }

  if (!getSupabaseConfig()) {
    redirect("/os/login?mode=setup&error=config");
  }

  const supabase = await createClient();
  const origin = await getOrigin();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/os/auth/callback`,
    },
  });

  if (error) {
    const message = error.message.toLowerCase();
    if (message.includes("already") || message.includes("registered")) {
      redirect("/os/login?mode=setup&error=already_registered");
    }
    redirect("/os/login?mode=setup&error=auth_failed");
  }

  redirect("/os/login?setup=1");
}

export async function sendMagicLink(formData: FormData) {
  const email = getEmail(formData);

  if (!email || !isAllowedOsEmail(email)) {
    // Don't reveal which addresses are authorized; show the same "sent" state.
    redirect("/os/login?sent=1");
  }

  if (!getSupabaseConfig()) {
    redirect("/os/login?error=config");
  }

  const supabase = await createClient();
  const origin = await getOrigin();

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
