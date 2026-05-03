import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Asset, Project, Task } from "@/lib/os/types";
import { Section, Stat } from "../_components/ui";

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

  const activeProjects = projects.filter((p) => p.status === "active");
  const openTasks = tasks.filter((t) => t.status !== "done");
  const today = new Date().toISOString().slice(0, 10);
  const overdue = openTasks.filter((t) => t.due_date && t.due_date < today);
  const sellable = assets.filter((a) => a.status === "ready-to-sell");

  return (
    <div>
      <div className="border-t-4 border-b-4 border-black py-3 mb-8">
        <h1 className="font-bold uppercase tracking-wider text-base">
          Overview
        </h1>
        <p className="text-xs uppercase tracking-wider mt-1">
          As of {new Date().toLocaleDateString("en-US", { dateStyle: "long" })}
        </p>
      </div>

      <Section label="At a Glance">
        <Stat label="Active Projects" value={activeProjects.length} />
        <Stat label="Open Tasks" value={openTasks.length} />
        <Stat label="Overdue" value={overdue.length} emphasize={overdue.length > 0} />
        <Stat label="Ready to Sell" value={sellable.length} />
      </Section>

      <Section label="Active Projects" right={`${activeProjects.length} total`}>
        {activeProjects.length === 0 ? (
          <p className="text-sm py-3">None.</p>
        ) : (
          <ul>
            {activeProjects.map((p) => (
              <li
                key={p.id}
                className="border-b border-black/30 py-3 flex items-baseline justify-between gap-4"
              >
                <Link
                  href={`/os/projects/${p.id}`}
                  className="font-bold text-sm hover:underline truncate"
                >
                  {p.name}
                </Link>
                <span className="font-mono text-[11px] uppercase tracking-wider whitespace-nowrap">
                  {p.brand} · {p.owner}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section label="Open Tasks" right={`${openTasks.length} total`}>
        {openTasks.length === 0 ? (
          <p className="text-sm py-3">None.</p>
        ) : (
          <ul>
            {openTasks.slice(0, 25).map((t) => {
              const isOverdue = !!(t.due_date && t.due_date < today);
              return (
                <li
                  key={t.id}
                  className="border-b border-black/30 py-3 flex items-baseline justify-between gap-4"
                >
                  <span className="flex items-baseline gap-2 min-w-0">
                    <span className="font-mono text-sm">
                      {t.status === "doing" ? "◐" : "○"}
                    </span>
                    <span
                      className={`text-sm truncate ${isOverdue ? "font-bold" : ""}`}
                    >
                      {isOverdue ? "! " : ""}
                      {t.title}
                    </span>
                  </span>
                  <span className="font-mono tabular-nums text-xs whitespace-nowrap">
                    {t.assignee} · {t.due_date ?? "—"}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </Section>

      <Section label="Sellable Assets" right={`${sellable.length} ready`}>
        {sellable.length === 0 ? (
          <p className="text-sm py-3">None ready.</p>
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
