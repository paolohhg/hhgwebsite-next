import { createClient } from "@/lib/supabase/server";
import type { Project, Task } from "@/lib/os/types";
import { CalendarPreview } from "../../_components/calendar";
import { PageHeader, Section } from "../../_components/ui";

export default async function CalendarPage() {
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

  return (
    <div>
      <PageHeader
        title="Calendar"
        eyebrow="Open task due dates for the current month"
        right={`${openDatedTasks.length} dated`}
      />

      <Section label="Month Preview">
        <CalendarPreview tasks={tasksWithProjects} />
      </Section>
    </div>
  );
}
