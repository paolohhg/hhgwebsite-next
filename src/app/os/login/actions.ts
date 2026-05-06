"use server";

import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
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
    const message = error.message.toLowerCase();
    if (message.includes("email not confirmed")) {
      redirect("/os/login?error=email_not_confirmed");
    }
    if (message.includes("invalid login credentials")) {
      redirect("/os/login?error=invalid_credentials");
    }
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

  const admin = createAdminClient();
  if (admin) {
    const { data: usersData, error: listError } =
      await admin.auth.admin.listUsers();
    if (listError) {
      redirect("/os/login?mode=setup&error=admin_failed");
    }

    const existing = usersData.users.find(
      (user) => user.email?.toLowerCase() === email,
    );

    const { error } = existing
      ? await admin.auth.admin.updateUserById(existing.id, {
          password,
          email_confirm: true,
        })
      : await admin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
        });

    if (error) {
      redirect("/os/login?mode=setup&error=admin_failed");
    }

    redirect("/os/login?password_set=1");
  }

  const supabase = await createClient();
  const origin = await getOrigin();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/os/auth/callback`,
    },
  });

  if (error) {
    const message = error.message.toLowerCase();
    if (message.includes("already") || message.includes("registered")) {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${origin}/os/auth/callback?next=/os/password`,
        },
      );
      if (resetError) {
        redirect("/os/login?mode=setup&error=reset_failed");
      }
      redirect("/os/login?reset=1");
    }
    redirect("/os/login?mode=setup&error=auth_failed");
  }

  if (data.user?.identities && data.user.identities.length === 0) {
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: `${origin}/os/auth/callback?next=/os/password`,
      },
    );
    if (resetError) {
      redirect("/os/login?mode=setup&error=reset_failed");
    }
    redirect("/os/login?reset=1");
  }

  if (data.session) {
    redirect("/os");
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
