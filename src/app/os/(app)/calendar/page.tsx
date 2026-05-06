import { createClient } from "@/lib/supabase/server";
import { TASK_ASSIGNEES, type Project, type Task } from "@/lib/os/types";
import { CalendarPreview, type CalendarView } from "../../_components/calendar";
import {
  Field,
  PageHeader,
  PrimaryButton,
  Section,
  SelectField,
  TextareaField,
} from "../../_components/ui";
import { createCalendarTask } from "../tasks/actions";

function normalizeDate(value?: string) {
  if (!value) return new Date().toISOString().slice(0, 10);
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return new Date().toISOString().slice(0, 10);
  return value;
}

function normalizeView(value?: string): CalendarView {
  return value === "day" || value === "week" || value === "month"
    ? value
    : "month";
}

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string; view?: string }>;
}) {
  const params = await searchParams;
  const selectedDate = normalizeDate(params.date);
  const view = normalizeView(params.view);
  const supabase = await createClient();
  const [tasksRes, projectsRes] = await Promise.all([
    supabase
      .from("tasks")
      .select("*")
      .order("due_date", { ascending: true, nullsFirst: false }),
    supabase
      .from("projects")
      .select("id,name")
      .order("name", { ascending: true }),
  ]);

  const tasks = (tasksRes.data ?? []) as Task[];
  const projects = (projectsRes.data ?? []) as Pick<Project, "id" | "name">[];
  const projectName = new Map(projects.map((project) => [project.id, project.name]));
  const tasksWithProjects = tasks.map((task) => ({
    ...task,
    projectName: task.project_id ? projectName.get(task.project_id) : undefined,
  }));
  const openDatedTasks = tasksWithProjects.filter(
    (task) => task.status !== "done" && task.due_date,
  );
  const selectedTasks = openDatedTasks.filter(
    (task) => task.due_date === selectedDate,
  );

  return (
    <div>
      <PageHeader
        title="Calendar"
        eyebrow="Click a day to add tasks or open dated work"
        right={`${selectedTasks.length} selected / ${openDatedTasks.length} dated`}
      />

      <Section
        label={`Add Task: ${new Date(`${selectedDate}T00:00:00`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`}
      >
        <form action={createCalendarTask.bind(null, selectedDate)}>
          <Field label="Title" name="title" required />
          <SelectField
            label="Assignee"
            name="assignee"
            options={TASK_ASSIGNEES}
            required
            defaultValue="Paolo"
          />
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
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </label>
          <TextareaField label="Notes" name="notes" rows={2} />
          <PrimaryButton>Create On This Day</PrimaryButton>
        </form>
      </Section>

      <Section label="Month Preview">
        <CalendarPreview
          tasks={tasksWithProjects}
          selectedDate={selectedDate}
          view={view}
        />
      </Section>
    </div>
  );
}
