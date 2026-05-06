import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  TASK_ASSIGNEES,
  type Project,
  type Task,
  type TaskStatus,
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
} from "../../_components/ui";
import { createTask, deleteTask, setTaskAssignee, toggleTaskStatus } from "./actions";

const GLYPH: Record<TaskStatus, string> = {
  open: "○",
  doing: "◐",
  done: "●",
};

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ owner?: string; project?: string }>;
}) {
  const params = await searchParams;
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
  const ownerFilter =
    params.owner === "Paolo" || params.owner === "Mel" ? params.owner : null;
  const projectFilter = params.project || null;
  const visibleTasks = tasks.filter((task) => {
    if (ownerFilter && task.assignee !== ownerFilter) return false;
    if (projectFilter && task.project_id !== projectFilter) return false;
    return true;
  });

  const overdue = visibleTasks.filter(
    (t) => t.status !== "done" && !!t.due_date && t.due_date < today,
  );
  const dueToday = visibleTasks.filter(
    (t) => t.status !== "done" && t.due_date === today,
  );
  const todayTasks = [
    ...overdue,
    ...dueToday.filter((task) => !overdue.includes(task)),
  ];
  const doing = visibleTasks.filter((t) => t.status === "doing");
  const open = visibleTasks.filter((t) => t.status === "open");
  const done = visibleTasks.filter((t) => t.status === "done").slice(0, 25);
  const openTotal = tasks.filter((t) => t.status !== "done").length;

  return (
    <div>
      <PageHeader
        title="Tasks"
        eyebrow={
          ownerFilter
            ? `${ownerFilter} view`
            : projectFilter
              ? "Project view"
              : "All owners"
        }
        right={`${openTotal} open`}
      />

      <Section label="Filters">
        <div className="border-b border-black/30 py-3 flex flex-wrap gap-x-5 gap-y-2 font-bold uppercase tracking-wider text-xs">
          <Link href="/os/tasks" className={!ownerFilter && !projectFilter ? "underline" : "hover:underline"}>
            All
          </Link>
          <Link href="/os/tasks?owner=Paolo" className={ownerFilter === "Paolo" ? "underline" : "hover:underline"}>
            Paolo
          </Link>
          <Link href="/os/tasks?owner=Mel" className={ownerFilter === "Mel" ? "underline" : "hover:underline"}>
            Mel
          </Link>
        </div>
      </Section>

      <ActionDisclosure label="New Task">
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
      </ActionDisclosure>

      <TaskList
        label="Today"
        tasks={todayTasks}
        projectName={projectName}
        today={today}
      />
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

      {visibleTasks.length === 0 ? (
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
            <MetaRow
              key={t.id}
              href={`/os/tasks/${t.id}`}
              marker={
                <form
                  action={toggleTaskStatus.bind(null, t.id, t.status)}
                  className="shrink-0"
                >
                  <button
                    type="submit"
                    aria-label={`Mark ${t.status === "done" ? "open" : "next"}`}
                    className="font-mono text-base leading-none hover:opacity-70 min-h-10 min-w-10 text-left"
                  >
                    {GLYPH[t.status]}
                  </button>
                </form>
              }
              title={
                <>
                  {isOverdue ? "! " : ""}
                  {t.title}
                </>
              }
              subtitle={proj ? `→ ${proj}` : undefined}
              meta={
                <>
                  {t.assignee}
                  <br />
                  {t.due_date ?? "—"}
                </>
              }
              bold={!muted || isOverdue}
            >
              {t.status !== "done" ? (
                <form
                  action={setTaskAssignee.bind(
                    null,
                    t.id,
                    t.assignee === "Paolo" ? "Mel" : "Paolo",
                  )}
                  className="shrink-0"
                >
                  <button
                    type="submit"
                    aria-label="Switch assignee"
                    className="font-bold uppercase tracking-wider text-[10px] underline hover:no-underline min-h-10"
                  >
                    Assign {t.assignee === "Paolo" ? "Mel" : "Paolo"}
                  </button>
                </form>
              ) : null}

              <form
                action={deleteTask.bind(null, t.id)}
                className="shrink-0 ml-2"
              >
                <DestructiveButton>×</DestructiveButton>
              </form>
            </MetaRow>
          );
        })}
      </ul>
    </Section>
  );
}
