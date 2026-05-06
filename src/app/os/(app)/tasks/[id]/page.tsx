import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  TASK_ASSIGNEES,
  TASK_STATUSES,
  type Project,
  type Task,
} from "@/lib/os/types";
import {
  Field,
  PageHeader,
  PrimaryButton,
  Section,
  SelectField,
  TextareaField,
} from "../../../_components/ui";
import { updateTask } from "../actions";

export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const [taskRes, projectsRes] = await Promise.all([
    supabase.from("tasks").select("*").eq("id", id).single(),
    supabase
      .from("projects")
      .select("id,name")
      .order("name", { ascending: true }),
  ]);

  if (taskRes.error || !taskRes.data) notFound();

  const task = taskRes.data as Task;
  const projects = (projectsRes.data ?? []) as Pick<Project, "id" | "name">[];

  return (
    <div>
      <Link
        href="/os/tasks"
        className="font-bold uppercase tracking-wider text-xs underline hover:no-underline"
      >
        ← All Tasks
      </Link>

      <PageHeader
        title={task.title}
        eyebrow={`${task.assignee} · ${task.status}`}
        right={task.due_date ?? "no date"}
      />

      <Section label="Edit Task">
        <form action={updateTask.bind(null, task.id)}>
          <Field
            label="Title"
            name="title"
            required
            defaultValue={task.title}
          />
          <SelectField
            label="Assignee"
            name="assignee"
            options={TASK_ASSIGNEES}
            required
            defaultValue={task.assignee}
          />
          <SelectField
            label="Status"
            name="status"
            options={TASK_STATUSES}
            required
            defaultValue={task.status}
          />
          <Field
            label="Due Date"
            name="due_date"
            type="date"
            defaultValue={task.due_date ?? ""}
          />
          <label className="block py-2">
            <span className="font-bold uppercase tracking-wider text-xs">
              Project
            </span>
            <select
              name="project_id"
              defaultValue={task.project_id ?? ""}
              className="mt-1 w-full border-b-2 border-black bg-transparent py-1.5 text-sm focus:outline-none appearance-none uppercase tracking-wider font-bold"
            >
              <option value="">— None —</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </label>
          <TextareaField
            label="Notes"
            name="notes"
            rows={5}
            defaultValue={task.notes ?? ""}
          />
          <PrimaryButton>Save Task</PrimaryButton>
        </form>
      </Section>

      <p className="font-mono tabular-nums text-[10px] uppercase tracking-wider text-black/60">
        Created {new Date(task.created_at).toLocaleString()} · Completed{" "}
        {task.completed_at ? new Date(task.completed_at).toLocaleString() : "-"}
      </p>
    </div>
  );
}
