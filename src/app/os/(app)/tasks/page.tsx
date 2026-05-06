import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  TASK_ASSIGNEES,
  type Project,
  type Task,
  type TaskStatus,
} from "@/lib/os/types";
import {
  Field,
  PrimaryButton,
  Section,
  SelectField,
  TextareaField,
} from "../../_components/ui";
import { createTask, deleteTask, toggleTaskStatus } from "./actions";

const GLYPH: Record<TaskStatus, string> = {
  open: "○",
  doing: "◐",
  done: "●",
};

export default async function TasksPage() {
  const supabase = await createClient();
  const [tasksRes, projectsRes] = await Promise.all([
    supabase
      .from("tasks")
      .select("*")
      .order("status", { ascending: true })
      .order("due_date", { ascending: true, nullsFirst: false }),
    supabase
      .from("projects")
      .select("id,name")
      .order("name", { ascending: true }),
  ]);

  const tasks = (tasksRes.data ?? []) as Task[];
  const projects = (projectsRes.data ?? []) as Pick<Project, "id" | "name">[];
  const projectName = new Map(projects.map((p) => [p.id, p.name]));
  const today = new Date().toISOString().slice(0, 10);

  const open = tasks.filter((t) => t.status === "open");
  const doing = tasks.filter((t) => t.status === "doing");
  const done = tasks.filter((t) => t.status === "done").slice(0, 25);

  return (
    <div>
      <div className="border-t-4 border-b-4 border-black py-3 mb-6 flex items-baseline justify-between">
        <h1 className="font-bold uppercase tracking-wider text-base">Tasks</h1>
        <span className="font-mono tabular-nums text-xs uppercase tracking-wider">
          {tasks.filter((t) => t.status !== "done").length} open
        </span>
      </div>

      <details className="mb-8 border-b-2 border-black">
        <summary className="cursor-pointer py-3 font-bold uppercase tracking-wider text-xs">
          + New Task
        </summary>
        <form action={createTask} className="pb-4">
          <Field label="Title" name="title" required />
          <SelectField
            label="Assignee"
            name="assignee"
            options={TASK_ASSIGNEES}
            required
            defaultValue="Paolo"
          />
          <Field label="Due Date" name="due_date" type="date" />
          <label className="block py-2">
            <span className="font-bold uppercase tracking-wider text-xs">
              Project
            </span>
            <select
              name="project_id"
              defaultValue=""
              className="mt-1 w-full border-b-2 border-black bg-transparent py-1.5 text-sm focus:outline-none appearance-none uppercase tracking-wider font-bold"
            >
              <option value="">— None —</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
          <TextareaField label="Notes" name="notes" rows={2} />
          <PrimaryButton>Create Task</PrimaryButton>
        </form>
      </details>

      <TaskList
        label="Doing"
        tasks={doing}
        projectName={projectName}
        today={today}
      />
      <TaskList
        label="Open"
        tasks={open}
        projectName={projectName}
        today={today}
      />
      <TaskList
        label="Done (last 25)"
        tasks={done}
        projectName={projectName}
        today={today}
        muted
      />

      {tasks.length === 0 ? (
        <p className="text-sm py-3">No tasks yet. Add one above.</p>
      ) : null}
    </div>
  );
}

function TaskList({
  label,
  tasks,
  projectName,
  today,
  muted = false,
}: {
  label: string;
  tasks: Task[];
  projectName: Map<string, string>;
  today: string;
  muted?: boolean;
}) {
  if (tasks.length === 0) return null;
  return (
    <Section label={label} right={`${tasks.length}`}>
      <ul>
        {tasks.map((t) => {
          const isOverdue =
            t.status !== "done" && !!t.due_date && t.due_date < today;
          const proj = t.project_id ? projectName.get(t.project_id) : null;
          return (
            <li
              key={t.id}
              className="border-b border-black/30 py-3 flex items-baseline justify-between gap-3"
            >
              <form
                action={toggleTaskStatus.bind(null, t.id, t.status)}
                className="shrink-0"
              >
                <button
                  type="submit"
                  aria-label={`Mark ${t.status === "done" ? "open" : "next"}`}
                  className="font-mono text-base leading-none hover:opacity-70"
                >
                  {GLYPH[t.status]}
                </button>
              </form>

              <div className="min-w-0 flex-1">
                <p
                  className={`text-sm truncate ${muted ? "" : "font-bold"} ${
                    isOverdue ? "font-bold" : ""
                  }`}
                >
                  <Link href={`/os/tasks/${t.id}`} className="hover:underline">
                    {isOverdue ? "! " : ""}
                    {t.title}
                  </Link>
                </p>
                {proj ? (
                  <p className="text-[11px] uppercase tracking-wider truncate">
                    → {proj}
                  </p>
                ) : null}
              </div>

              <div className="font-mono tabular-nums text-xs whitespace-nowrap text-right shrink-0">
                {t.assignee}
                <br />
                {t.due_date ?? "—"}
              </div>

              <form
                action={deleteTask.bind(null, t.id)}
                className="shrink-0 ml-2"
              >
                <button
                  type="submit"
                  aria-label="Delete task"
                  className="font-mono text-sm hover:font-bold"
                >
                  ×
                </button>
              </form>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
