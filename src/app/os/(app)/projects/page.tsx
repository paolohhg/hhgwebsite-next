import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  BRANDS,
  OWNERS,
  PROJECT_STATUSES,
  REVENUE_TIERS,
  type Project,
} from "@/lib/os/types";
import {
  Field,
  PrimaryButton,
  Section,
  SelectField,
  TextareaField,
} from "../../_components/ui";
import { createProject } from "./actions";

export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .order("status", { ascending: true })
    .order("updated_at", { ascending: false });
  const projects = (data ?? []) as Project[];

  const grouped = PROJECT_STATUSES.map((s) => ({
    status: s,
    items: projects.filter((p) => p.status === s),
  }));

  return (
    <div>
      <div className="border-t-4 border-b-4 border-black py-3 mb-6 flex items-baseline justify-between">
        <h1 className="font-bold uppercase tracking-wider text-base">
          Projects
        </h1>
        <span className="font-mono tabular-nums text-xs uppercase tracking-wider">
          {projects.length} total
        </span>
      </div>

      <details className="mb-8 border-b-2 border-black">
        <summary className="cursor-pointer py-3 font-bold uppercase tracking-wider text-xs">
          + New Project
        </summary>
        <form action={createProject} className="pb-4">
          <Field label="Name" name="name" required />
          <SelectField
            label="Brand"
            name="brand"
            options={BRANDS}
            required
            defaultValue={BRANDS[0]}
          />
          <SelectField
            label="Status"
            name="status"
            options={PROJECT_STATUSES}
            required
            defaultValue="active"
          />
          <SelectField
            label="Owner"
            name="owner"
            options={OWNERS}
            required
            defaultValue="Paolo"
          />
          <SelectField
            label="Revenue Tier"
            name="revenue_tier"
            options={REVENUE_TIERS}
            allowEmpty
          />
          <Field label="Next Action" name="next_action" />
          <TextareaField label="Description" name="description" rows={2} />
          <TextareaField label="Notes" name="notes" rows={3} />
          <PrimaryButton>Create Project</PrimaryButton>
        </form>
      </details>

      {grouped.map(({ status, items }) =>
        items.length === 0 ? null : (
          <Section
            key={status}
            label={status}
            right={`${items.length}`}
          >
            <ul>
              {items.map((p) => (
                <li
                  key={p.id}
                  className="border-b border-black/30 py-3 flex items-baseline justify-between gap-4"
                >
                  <Link
                    href={`/os/projects/${p.id}`}
                    className="min-w-0 flex-1 hover:underline"
                  >
                    <span className="font-bold text-sm truncate block">
                      {p.name}
                    </span>
                    {p.next_action ? (
                      <span className="text-xs block truncate">
                        → {p.next_action}
                      </span>
                    ) : null}
                  </Link>
                  <span className="font-mono text-[11px] uppercase tracking-wider whitespace-nowrap text-right">
                    {p.brand}
                    <br />
                    {p.owner}
                    {p.revenue_tier ? ` · ${p.revenue_tier}` : ""}
                  </span>
                </li>
              ))}
            </ul>
          </Section>
        ),
      )}

      {projects.length === 0 ? (
        <p className="text-sm py-3">No projects yet. Add one above.</p>
      ) : null}
    </div>
  );
}
