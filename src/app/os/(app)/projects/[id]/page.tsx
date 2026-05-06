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
  ActionDisclosure,
  DestructiveButton,
  Field,
  MetaRow,
  PageHeader,
  PrimaryButton,
  Section,
  SelectField,
  TextareaField,
} from "../../../_components/ui";
import { deleteProject, updateProject } from "../actions";
import { createTask } from "../../tasks/actions";

const TASK_ORDER = ["doing", "open", "done"] as const;

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
  const tasksByStatus = TASK_ORDER.map((status) => ({
    status,
    items: tasks.filter((task) => task.status === status),
  }));

  return (
    <div>
      <Link
        href="/os/projects"
        className="font-bold uppercase tracking-wider text-xs underline hover:no-underline"
      >
        ← All Projects
      </Link>

      <PageHeader
        title={project.name}
        eyebrow={`${project.brand} · ${project.status} · ${project.owner}${
          project.revenue_tier ? ` · ${project.revenue_tier}` : ""
        }`}
        right={`Updated ${new Date(project.updated_at).toLocaleDateString()}`}
      />

      <Section label="Project Summary">
        <div className="border-b border-black/30 py-3 space-y-3">
          {project.next_action ? (
            <div>
              <p className="font-bold uppercase tracking-wider text-xs">
                Next Action
              </p>
              <p className="text-sm leading-relaxed">{project.next_action}</p>
            </div>
          ) : null}
          {project.description ? (
            <div>
              <p className="font-bold uppercase tracking-wider text-xs">
                Description
              </p>
              <p className="text-sm leading-relaxed">{project.description}</p>
            </div>
          ) : null}
          {project.notes ? (
            <div>
              <p className="font-bold uppercase tracking-wider text-xs">
                Notes
              </p>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {project.notes}
              </p>
            </div>
          ) : null}
          {!project.next_action && !project.description && !project.notes ? (
            <p className="text-sm leading-relaxed">
              Add a next action, description, or notes below so this project has
              enough context for a quick decision.
            </p>
          ) : null}
        </div>
      </Section>

      <ActionDisclosure label="Quick Task">
        <form action={createTask}>
          <input type="hidden" name="project_id" value={project.id} />
          <Field label="Title" name="title" required />
          <SelectField
            label="Assignee"
            name="assignee"
            options={["Paolo", "Mel"]}
            required
            defaultValue={project.owner === "Mel" ? "Mel" : "Paolo"}
          />
          <Field label="Due Date" name="due_date" type="date" />
          <TextareaField label="Notes" name="notes" rows={2} />
          <PrimaryButton>Create Task</PrimaryButton>
        </form>
      </ActionDisclosure>

      <Section label="Linked Tasks" right={`${tasks.length}`}>
        {tasks.length === 0 ? (
          <p className="text-sm py-3">None yet.</p>
        ) : (
          <div className="space-y-6">
            {tasksByStatus.map(({ status, items }) =>
              items.length === 0 ? null : (
                <div key={status}>
                  <p className="font-bold uppercase tracking-wider text-[10px]">
                    {status}
                  </p>
                  <ul>
                    {items.map((t) => (
                      <MetaRow
                        key={t.id}
                        href={`/os/tasks/${t.id}`}
                        marker={
                          t.status === "done"
                            ? "●"
                            : t.status === "doing"
                              ? "◐"
                              : "○"
                        }
                        title={t.title}
                        meta={`${t.assignee} · ${t.due_date ?? "—"}`}
                        bold={t.status !== "done"}
                      />
                    ))}
                  </ul>
                </div>
              ),
            )}
          </div>
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
        <form action={deleteProject.bind(null, project.id)} className="py-3">
          <DestructiveButton>Delete Project</DestructiveButton>
        </form>
      </Section>

      <p className="font-mono tabular-nums text-[10px] uppercase tracking-wider text-black/60">
        Created {new Date(project.created_at).toLocaleString()} · Updated{" "}
        {new Date(project.updated_at).toLocaleString()}
      </p>
    </div>
  );
}
