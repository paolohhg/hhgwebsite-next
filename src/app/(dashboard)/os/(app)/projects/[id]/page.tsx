import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  BRANDS,
  OWNERS,
  PROJECT_STATUSES,
  REVENUE_TIERS,
  type Project,
  type Task,
} from "@/lib/os/types";
import {
  Field,
  PrimaryButton,
  Section,
  SelectField,
  TextareaField,
} from "../../../_components/ui";
import { deleteProject, updateProject } from "../actions";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const [projectRes, tasksRes] = await Promise.all([
    supabase.from("projects").select("*").eq("id", id).single(),
    supabase
      .from("tasks")
      .select("*")
      .eq("project_id", id)
      .order("status", { ascending: true })
      .order("due_date", { ascending: true, nullsFirst: false }),
  ]);

  if (projectRes.error || !projectRes.data) notFound();
  const project = projectRes.data as Project;
  const tasks = (tasksRes.data ?? []) as Task[];

  return (
    <div>
      <Link
        href="/os/projects"
        className="font-bold uppercase tracking-wider text-xs underline hover:no-underline"
      >
        ← All Projects
      </Link>

      <div className="border-t-4 border-b-4 border-black py-3 mt-4 mb-6">
        <h1 className="font-bold uppercase tracking-wider text-base">
          {project.name}
        </h1>
        <p className="font-mono text-[11px] uppercase tracking-wider mt-1">
          {project.brand} · {project.status} · {project.owner}
          {project.revenue_tier ? ` · ${project.revenue_tier}` : ""}
        </p>
      </div>

      <Section label="Linked Tasks" right={`${tasks.length}`}>
        {tasks.length === 0 ? (
          <p className="text-sm py-3">None yet.</p>
        ) : (
          <ul>
            {tasks.map((t) => (
              <li
                key={t.id}
                className="border-b border-black/30 py-3 flex items-baseline justify-between gap-4"
              >
                <span className="flex items-baseline gap-2 min-w-0">
                  <span className="font-mono text-sm">
                    {t.status === "done"
                      ? "●"
                      : t.status === "doing"
                        ? "◐"
                        : "○"}
                  </span>
                  <span
                    className={`text-sm truncate ${t.status !== "done" ? "font-bold" : ""}`}
                  >
                    {t.title}
                  </span>
                </span>
                <span className="font-mono tabular-nums text-xs whitespace-nowrap">
                  {t.assignee} · {t.due_date ?? "—"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section label="Edit Project">
        <form action={updateProject.bind(null, project.id)}>
          <Field
            label="Name"
            name="name"
            required
            defaultValue={project.name}
          />
          <SelectField
            label="Brand"
            name="brand"
            options={BRANDS}
            required
            defaultValue={project.brand}
          />
          <SelectField
            label="Status"
            name="status"
            options={PROJECT_STATUSES}
            required
            defaultValue={project.status}
          />
          <SelectField
            label="Owner"
            name="owner"
            options={OWNERS}
            required
            defaultValue={project.owner}
          />
          <SelectField
            label="Revenue Tier"
            name="revenue_tier"
            options={REVENUE_TIERS}
            allowEmpty
            defaultValue={project.revenue_tier ?? ""}
          />
          <Field
            label="Next Action"
            name="next_action"
            defaultValue={project.next_action ?? ""}
          />
          <TextareaField
            label="Description"
            name="description"
            rows={2}
            defaultValue={project.description ?? ""}
          />
          <TextareaField
            label="Notes"
            name="notes"
            rows={4}
            defaultValue={project.notes ?? ""}
          />
          <PrimaryButton>Save Changes</PrimaryButton>
        </form>
      </Section>

      <Section label="Danger">
        <form
          action={deleteProject.bind(null, project.id)}
          className="py-3"
        >
          <button
            type="submit"
            className="font-bold uppercase tracking-wider text-xs underline hover:no-underline"
          >
            Delete Project
          </button>
        </form>
      </Section>

      <p className="font-mono tabular-nums text-[10px] uppercase tracking-wider text-black/60">
        Created {new Date(project.created_at).toLocaleString()} · Updated{" "}
        {new Date(project.updated_at).toLocaleString()}
      </p>
    </div>
  );
}
