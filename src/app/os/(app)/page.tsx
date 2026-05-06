import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Asset, Project, Task } from "@/lib/os/types";
import { CalendarPreview } from "../_components/calendar";
import { EmptyState, PageHeader, Section, Stat } from "../_components/ui";

type TaskWithProject = Task & {
  projectName?: string;
};

const DAY_MS = 24 * 60 * 60 * 1000;

function formatDate(value: string | null) {
  if (!value) return "-";
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function daysSince(value: string) {
  const updated = new Date(value).getTime();
  if (Number.isNaN(updated)) return 0;
  return Math.floor((Date.now() - updated) / DAY_MS);
}

function TaskRow({
  task,
  today,
}: {
  task: TaskWithProject;
  today: string;
}) {
  const isOverdue = !!(task.due_date && task.due_date < today);
  const isDueToday = task.due_date === today;

  return (
    <li className="border-b border-black/30 py-3 flex items-start justify-between gap-4">
      <div className="min-w-0 flex-1">
        <p
          className={`text-sm truncate ${
            isOverdue || isDueToday || task.status === "doing" ? "font-bold" : ""
          }`}
        >
          {isOverdue ? "! " : ""}
          {task.status === "doing" ? "◐ " : "○ "}
          {task.title}
        </p>
        {task.projectName ? (
          <p className="text-[11px] uppercase tracking-wider truncate">
            {task.projectName}
          </p>
        ) : null}
      </div>
      <span className="font-mono tabular-nums text-xs whitespace-nowrap text-right">
        {task.assignee}
        <br />
        {formatDate(task.due_date)}
      </span>
    </li>
  );
}

export default async function OverviewPage() {
  const supabase = await createClient();
  const [projectsRes, tasksRes, assetsRes] = await Promise.all([
    supabase
      .from("projects")
      .select("*")
      .order("updated_at", { ascending: false }),
    supabase
      .from("tasks")
      .select("*")
      .order("due_date", { ascending: true, nullsFirst: false }),
    supabase
      .from("assets")
      .select("*")
      .order("created_at", { ascending: false }),
  ]);

  const projects = (projectsRes.data ?? []) as Project[];
  const tasks = (tasksRes.data ?? []) as Task[];
  const assets = (assetsRes.data ?? []) as Asset[];

  const projectName = new Map(projects.map((p) => [p.id, p.name]));
  const activeProjects = projects.filter((p) => p.status === "active");
  const openTasks = tasks.filter((t) => t.status !== "done");
  const today = new Date().toISOString().slice(0, 10);
  const tasksWithProjects: TaskWithProject[] = openTasks.map((task) => ({
    ...task,
    projectName: task.project_id ? projectName.get(task.project_id) : undefined,
  }));
  const overdue = tasksWithProjects.filter((t) => t.due_date && t.due_date < today);
  const dueToday = tasksWithProjects.filter((t) => t.due_date === today);
  const doing = tasksWithProjects.filter((t) => t.status === "doing");
  const todayQueue = [...overdue, ...dueToday, ...doing.filter((t) => !overdue.includes(t) && !dueToday.includes(t))];
  const sellable = assets.filter((a) => a.status === "ready-to-sell");
  const nextActions = activeProjects
    .filter((p) => p.next_action)
    .sort((a, b) => daysSince(b.updated_at) - daysSince(a.updated_at));
  const staleProjects = activeProjects
    .filter((p) => daysSince(p.updated_at) >= 14)
    .sort((a, b) => daysSince(b.updated_at) - daysSince(a.updated_at));
  const paoloOpen = openTasks.filter((t) => t.assignee === "Paolo");
  const melOpen = openTasks.filter((t) => t.assignee === "Mel");

  return (
    <div>
      <PageHeader
        title="Command Center"
        eyebrow={`Today is ${new Date().toLocaleDateString("en-US", { dateStyle: "long" })}`}
        right={`${openTasks.length} open / ${activeProjects.length} active`}
      />

      <Section label="At a Glance">
        <Stat label="Active Projects" value={activeProjects.length} />
        <Stat label="Open Tasks" value={openTasks.length} />
        <Stat
          label="Needs Attention"
          value={overdue.length + dueToday.length + staleProjects.length}
          emphasize={overdue.length + dueToday.length + staleProjects.length > 0}
        />
        <Stat label="Ready to Sell" value={sellable.length} />
      </Section>

      <Section label="Today" right={`${todayQueue.length} items`}>
        {todayQueue.length === 0 ? (
          <EmptyState>
            Nothing is overdue, due today, or in doing. Add due dates on the
            Tasks page when work needs to surface here.
          </EmptyState>
        ) : (
          <ul>
            {todayQueue.slice(0, 12).map((task) => (
              <TaskRow key={task.id} task={task} today={today} />
            ))}
          </ul>
        )}
      </Section>

      <Section label="Calendar" right={<Link href="/os/calendar">Open</Link>}>
        <CalendarPreview tasks={tasksWithProjects} compact view="month" />
      </Section>

      <Section label="Next Actions" right={`${nextActions.length} active`}>
        {nextActions.length === 0 ? (
          <EmptyState>
            No active projects have a next action. Add one on a project detail
            page so the dashboard can tell you what moves next.
          </EmptyState>
        ) : (
          <ul>
            {nextActions.slice(0, 10).map((project) => (
              <li
                key={project.id}
                className="border-b border-black/30 py-3 flex items-start justify-between gap-4"
              >
                <Link
                  href={`/os/projects/${project.id}`}
                  className="min-w-0 flex-1 hover:underline"
                >
                  <span className="font-bold text-sm truncate block">
                    {project.name}
                  </span>
                  <span className="text-xs truncate block">
                    {project.next_action}
                  </span>
                </Link>
                <span className="font-mono text-[11px] uppercase tracking-wider whitespace-nowrap text-right">
                  {project.owner}
                  <br />
                  {project.brand}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section label="Stale Active Projects" right={`${staleProjects.length} stale`}>
        {staleProjects.length === 0 ? (
          <EmptyState>
            No active project has gone untouched for 14 days. This section will
            catch drifting work before it disappears.
          </EmptyState>
        ) : (
          <ul>
            {staleProjects.slice(0, 8).map((project) => (
              <li
                key={project.id}
                className="border-b border-black/30 py-3 flex items-start justify-between gap-4"
              >
                <Link
                  href={`/os/projects/${project.id}`}
                  className="font-bold text-sm hover:underline truncate"
                >
                  {project.name}
                </Link>
                <span className="font-mono tabular-nums text-xs whitespace-nowrap text-right">
                  {daysSince(project.updated_at)}d
                  <br />
                  {project.owner}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section label="Owner Load">
        <Stat label="Paolo Open Tasks" value={paoloOpen.length} />
        <Stat label="Mel Open Tasks" value={melOpen.length} />
        <Stat label="Shared Projects" value={activeProjects.filter((p) => p.owner === "Both").length} />
      </Section>

      <Section label="Sellable Assets" right={`${sellable.length} ready`}>
        {sellable.length === 0 ? (
          <EmptyState>
            No assets are marked ready-to-sell. Move assets into that status
            when they are packaged enough to offer or reuse.
          </EmptyState>
        ) : (
          <ul>
            {sellable.slice(0, 10).map((a) => (
              <li
                key={a.id}
                className="border-b border-black/30 py-3 flex items-baseline justify-between gap-4"
              >
                <span className="font-bold text-sm truncate">{a.name}</span>
                <span className="font-mono text-[11px] uppercase tracking-wider whitespace-nowrap">
                  {a.brand} · {a.category}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}
