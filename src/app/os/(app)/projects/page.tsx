import { createClient } from "@/lib/supabase/server";
import {
  BRANDS,
  OWNERS,
  PROJECT_STATUSES,
  REVENUE_TIERS,
  type Project,
} from "@/lib/os/types";
import {
  ActionDisclosure,
  Field,
  MetaRow,
  PageHeader,
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
      <PageHeader title="Projects" right={`${projects.length} total`} />

      <ActionDisclosure label="New Project">
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
      </ActionDisclosure>

      {grouped.map(({ status, items }) =>
        items.length === 0 ? null : (
          <Section
            key={status}
            label={status}
            right={`${items.length}`}
          >
            <ul>
              {items.map((p) => (
                <MetaRow
                  key={p.id}
                  href={`/os/projects/${p.id}`}
                  title={p.name}
                  subtitle={p.next_action ? `→ ${p.next_action}` : undefined}
                  meta={
                    <>
                      {p.brand}
                      <br />
                      {p.owner}
                      {p.revenue_tier ? ` · ${p.revenue_tier}` : ""}
                    </>
                  }
                  bold
                />
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
