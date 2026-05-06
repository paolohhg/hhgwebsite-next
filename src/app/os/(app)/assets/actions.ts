"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

function str(v: FormDataEntryValue | null) {
  return v == null ? null : String(v).trim() || null;
}

export async function createAsset(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("assets").insert({
    name: String(formData.get("name") || "").trim(),
    category: String(formData.get("category")),
    brand: String(formData.get("brand")),
    status: String(formData.get("status")),
    drive_url: str(formData.get("drive_url")),
    notes: str(formData.get("notes")),
  });
  if (error) throw new Error(error.message);
  revalidatePath("/os/assets");
  revalidatePath("/os");
}

export async function updateAssetStatus(id: string, status: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("assets")
    .update({ status })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/os/assets");
  revalidatePath("/os");
}

export async function updateAsset(id: string, formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("assets")
    .update({
      name: String(formData.get("name") || "").trim(),
      category: String(formData.get("category")),
      brand: String(formData.get("brand")),
      status: String(formData.get("status")),
      drive_url: str(formData.get("drive_url")),
      notes: str(formData.get("notes")),
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/os/assets");
  revalidatePath("/os");
}

export async function deleteAsset(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("assets").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/os/assets");
  revalidatePath("/os");
}
