import { createClient } from "@/lib/supabase/server";
import {
  ASSET_CATEGORIES,
  ASSET_STATUSES,
  BRANDS,
  type Asset,
} from "@/lib/os/types";
import {
  ActionDisclosure,
  DestructiveButton,
  Field,
  PageHeader,
  PrimaryButton,
  Section,
  SelectField,
  TextareaField,
} from "../../_components/ui";
import { createAsset, deleteAsset, updateAsset } from "./actions";
import AssetStatusSelect from "./status-select";

export default async function AssetsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("assets")
    .select("*")
    .order("status", { ascending: true })
    .order("created_at", { ascending: false });
  const assets = (data ?? []) as Asset[];

  const grouped = ASSET_STATUSES.map((s) => ({
    status: s,
    items: assets.filter((a) => a.status === s),
  }));

  return (
    <div>
      <PageHeader title="Assets" right={`${assets.length} total`} />

      <ActionDisclosure label="New Asset">
        <form action={createAsset} className="pb-4">
          <Field label="Name" name="name" required />
          <SelectField
            label="Category"
            name="category"
            options={ASSET_CATEGORIES}
            required
            defaultValue="product"
          />
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
            options={ASSET_STATUSES}
            required
            defaultValue="needs-work"
          />
          <Field
            label="Drive URL"
            name="drive_url"
            type="url"
            placeholder="https://"
          />
          <TextareaField label="Notes" name="notes" rows={3} />
          <PrimaryButton>Create Asset</PrimaryButton>
        </form>
      </ActionDisclosure>

      {grouped.map(({ status, items }) =>
        items.length === 0 ? null : (
          <Section key={status} label={status} right={`${items.length}`}>
            <ul>
              {items.map((a) => (
                <li
                  key={a.id}
                  className="border-b border-black/30 py-3"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm truncate ${a.status === "ready-to-sell" ? "font-bold" : ""}`}
                      >
                        {a.name}
                      </p>
                      {a.drive_url ? (
                        <a
                          href={a.drive_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] uppercase tracking-wider underline hover:no-underline truncate block"
                        >
                          Open Drive →
                        </a>
                      ) : null}
                    </div>

                    <span className="font-mono text-[11px] uppercase tracking-wider whitespace-nowrap text-right">
                      {a.brand}
                      <br />
                      {a.category}
                    </span>

                    <AssetStatusSelect id={a.id} status={a.status} />

                    <form
                      action={deleteAsset.bind(null, a.id)}
                      className="shrink-0"
                    >
                      <DestructiveButton>×</DestructiveButton>
                    </form>
                  </div>
                  <details className="mt-3">
                    <summary className="cursor-pointer font-bold uppercase tracking-wider text-[10px] underline">
                      Edit Asset
                    </summary>
                    <form action={updateAsset.bind(null, a.id)} className="pt-3">
                      <Field label="Name" name="name" required defaultValue={a.name} />
                      <SelectField
                        label="Category"
                        name="category"
                        options={ASSET_CATEGORIES}
                        required
                        defaultValue={a.category}
                      />
                      <SelectField
                        label="Brand"
                        name="brand"
                        options={BRANDS}
                        required
                        defaultValue={a.brand}
                      />
                      <SelectField
                        label="Status"
                        name="status"
                        options={ASSET_STATUSES}
                        required
                        defaultValue={a.status}
                      />
                      <Field
                        label="Drive URL"
                        name="drive_url"
                        type="url"
                        placeholder="https://"
                        defaultValue={a.drive_url ?? ""}
                      />
                      <TextareaField
                        label="Notes"
                        name="notes"
                        rows={3}
                        defaultValue={a.notes ?? ""}
                      />
                      <PrimaryButton>Save Asset</PrimaryButton>
                    </form>
                  </details>
                </li>
              ))}
            </ul>
          </Section>
        ),
      )}

      {assets.length === 0 ? (
        <p className="text-sm py-3">No assets yet. Add one above.</p>
      ) : null}
    </div>
  );
}
