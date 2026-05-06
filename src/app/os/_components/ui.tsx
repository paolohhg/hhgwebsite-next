import type { ReactNode } from "react";
import Link from "next/link";

export function PageHeader({
  title,
  eyebrow,
  right,
}: {
  title: string;
  eyebrow?: ReactNode;
  right?: ReactNode;
}) {
  return (
    <div className="border-t-4 border-b-4 border-black py-3 mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-bold uppercase tracking-wider text-base">
          {title}
        </h1>
        {eyebrow ? (
          <p className="text-xs uppercase tracking-wider mt-1">{eyebrow}</p>
        ) : null}
      </div>
      {right ? (
        <div className="font-mono tabular-nums text-xs uppercase tracking-wider">
          {right}
        </div>
      ) : null}
    </div>
  );
}

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

export function ActionDisclosure({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <details className="mb-8 border-b-2 border-black">
      <summary className="cursor-pointer py-3 font-bold uppercase tracking-wider text-xs">
        + {label}
      </summary>
      <div className="pb-4">{children}</div>
    </details>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <p className="border-b border-black/30 py-3 text-sm leading-relaxed">
      {children}
    </p>
  );
}

export function MetaRow({
  href,
  title,
  subtitle,
  meta,
  marker,
  bold = false,
  children,
}: {
  href?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  meta?: ReactNode;
  marker?: ReactNode;
  bold?: boolean;
  children?: ReactNode;
}) {
  const titleNode = href ? (
    <Link href={href} className="hover:underline">
      {title}
    </Link>
  ) : (
    title
  );

  const body = (
    <>
      {marker ? (
        <span className="font-mono text-base leading-none shrink-0">{marker}</span>
      ) : null}
      <div className="min-w-0 flex-1">
        <p className={`text-sm truncate ${bold ? "font-bold" : ""}`}>
          {titleNode}
        </p>
        {subtitle ? (
          <p className="text-[11px] uppercase tracking-wider truncate">
            {subtitle}
          </p>
        ) : null}
      </div>
    </>
  );

  return (
    <li className="border-b border-black/30 py-3 flex items-start justify-between gap-3">
      <div className="min-w-0 flex flex-1 items-start gap-3">{body}</div>
      {meta ? (
        <span className="font-mono text-[11px] uppercase tracking-wider whitespace-nowrap text-right shrink-0">
          {meta}
        </span>
      ) : null}
      {children}
    </li>
  );
}

export function Stat({
  label,
  value,
  emphasize = false,
  href,
}: {
  label: string;
  value: string | number;
  emphasize?: boolean;
  href?: string;
}) {
  const content = (
    <>
      <span className="text-sm uppercase tracking-wider">{label}</span>
      <span
        className={`font-mono tabular-nums text-2xl ${emphasize ? "font-bold" : ""}`}
      >
        {typeof value === "number" ? value.toString().padStart(2, "0") : value}
      </span>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="border-b border-black/30 py-3 flex items-baseline justify-between hover:bg-black hover:text-white transition-colors"
      >
        {content}
      </Link>
    );
  }

  return (
    <div className="border-b border-black/30 py-3 flex items-baseline justify-between">
      {content}
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

export function DestructiveButton({ children }: { children: ReactNode }) {
  return (
    <button
      type="submit"
      className="font-bold uppercase tracking-wider text-xs underline hover:no-underline"
    >
      {children}
    </button>
  );
}
