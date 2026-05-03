"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function str(v: FormDataEntryValue | null) {
  return v == null ? null : String(v).trim() || null;
}

export async function createProject(formData: FormData) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .insert({
      name: String(formData.get("name") || "").trim(),
      description: str(formData.get("description")),
      brand: String(formData.get("brand")),
      status: String(formData.get("status")),
      revenue_tier: str(formData.get("revenue_tier")),
      owner: String(formData.get("owner")),
      next_action: str(formData.get("next_action")),
      notes: str(formData.get("notes")),
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  revalidatePath("/os/projects");
  revalidatePath("/os");
  redirect(`/os/projects/${data.id}`);
}

export async function updateProject(id: string, formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("projects")
    .update({
      name: String(formData.get("name") || "").trim(),
      description: str(formData.get("description")),
      brand: String(formData.get("brand")),
      status: String(formData.get("status")),
      revenue_tier: str(formData.get("revenue_tier")),
      owner: String(formData.get("owner")),
      next_action: str(formData.get("next_action")),
      notes: str(formData.get("notes")),
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/os/projects/${id}`);
  revalidatePath("/os/projects");
  revalidatePath("/os");
  redirect(`/os/projects/${id}`);
}

export async function deleteProject(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/os/projects");
  revalidatePath("/os");
  redirect("/os/projects");
}
