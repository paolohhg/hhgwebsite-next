"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { TaskStatus } from "@/lib/os/types";

const NEXT: Record<TaskStatus, TaskStatus> = {
  open: "doing",
  doing: "done",
  done: "open",
};

function str(v: FormDataEntryValue | null) {
  return v == null ? null : String(v).trim() || null;
}

export async function createTask(formData: FormData) {
  const supabase = await createClient();
  const projectId = str(formData.get("project_id"));
  const { error } = await supabase.from("tasks").insert({
    project_id: projectId,
    title: String(formData.get("title") || "").trim(),
    assignee: String(formData.get("assignee")),
    due_date: str(formData.get("due_date")),
    notes: str(formData.get("notes")),
  });
  if (error) throw new Error(error.message);
  revalidatePath("/os/tasks");
  revalidatePath("/os");
  if (projectId) revalidatePath(`/os/projects/${projectId}`);
}

export async function toggleTaskStatus(id: string, current: TaskStatus) {
  const supabase = await createClient();
  const next = NEXT[current];
  const { error } = await supabase
    .from("tasks")
    .update({
      status: next,
      completed_at: next === "done" ? new Date().toISOString() : null,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/os/tasks");
  revalidatePath("/os");
}

export async function deleteTask(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/os/tasks");
  revalidatePath("/os");
}
