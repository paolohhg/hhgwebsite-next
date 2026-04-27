import type { ReactNode } from "react";

export function Section({
  label,
  right,
  children,
}: {
  label: string;
  right?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="mb-10">
      <div className="border-t-2 border-black pt-2 mb-3 flex items-baseline justify-between">
        <h2 className="font-bold uppercase tracking-wider text-xs">{label}</h2>
        {right ? (
          <span className="font-mono tabular-nums text-xs uppercase tracking-wider">
            {right}
          </span>
        ) : null}
      </div>
      {children}
    </section>
  );
}

export function Row({
  children,
  bold = false,
}: {
  children: ReactNode;
  bold?: boolean;
}) {
  return (
    <div
      className={`border-b border-black/30 py-3 flex items-baseline justify-between gap-4 ${bold ? "font-bold" : ""}`}
    >
      {children}
    </div>
  );
}

export function Stat({
  label,
  value,
  emphasize = false,
}: {
  label: string;
  value: string | number;
  emphasize?: boolean;
}) {
  return (
    <div className="border-b border-black/30 py-3 flex items-baseline justify-between">
      <span className="text-sm uppercase tracking-wider">{label}</span>
      <span
        className={`font-mono tabular-nums text-2xl ${emphasize ? "font-bold" : ""}`}
      >
        {typeof value === "number" ? value.toString().padStart(2, "0") : value}
      </span>
    </div>
  );
}

export function Field({
  label,
  name,
  type = "text",
  required = false,
  defaultValue = "",
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <label className="block py-2">
      <span className="font-bold uppercase tracking-wider text-xs">
        {label}
        {required ? " *" : ""}
      </span>
      <input
        type={type}
        name={name}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="mt-1 w-full border-b-2 border-black bg-transparent py-1.5 text-sm focus:outline-none"
      />
    </label>
  );
}

export function SelectField({
  label,
  name,
  options,
  required = false,
  defaultValue = "",
  allowEmpty = false,
}: {
  label: string;
  name: string;
  options: readonly string[];
  required?: boolean;
  defaultValue?: string;
  allowEmpty?: boolean;
}) {
  return (
    <label className="block py-2">
      <span className="font-bold uppercase tracking-wider text-xs">
        {label}
        {required ? " *" : ""}
      </span>
      <select
        name={name}
        required={required}
        defaultValue={defaultValue}
        className="mt-1 w-full border-b-2 border-black bg-transparent py-1.5 text-sm focus:outline-none appearance-none uppercase tracking-wider font-bold"
      >
        {allowEmpty ? <option value="">—</option> : null}
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

export function TextareaField({
  label,
  name,
  defaultValue = "",
  rows = 3,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  rows?: number;
}) {
  return (
    <label className="block py-2">
      <span className="font-bold uppercase tracking-wider text-xs">
        {label}
      </span>
      <textarea
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        className="mt-1 w-full border-b-2 border-black bg-transparent py-1.5 text-sm focus:outline-none resize-none leading-relaxed"
      />
    </label>
  );
}

export function PrimaryButton({
  children,
  type = "submit",
}: {
  children: ReactNode;
  type?: "submit" | "button";
}) {
  return (
    <button
      type={type}
      className="w-full border-t-2 border-b-2 border-black py-3 mt-4 font-bold uppercase tracking-wider text-sm hover:bg-black hover:text-white transition-colors"
    >
      {children}
    </button>
  );
}

export function GhostButton({ children }: { children: ReactNode }) {
  return (
    <button
      type="submit"
      className="font-bold uppercase tracking-wider text-xs underline hover:no-underline"
    >
      {children}
    </button>
  );
}
