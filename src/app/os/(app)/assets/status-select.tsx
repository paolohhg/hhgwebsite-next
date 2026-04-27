"use client";

import { useTransition } from "react";
import { ASSET_STATUSES, type AssetStatus } from "@/lib/os/types";
import { updateAssetStatus } from "./actions";

export default function AssetStatusSelect({
  id,
  status,
}: {
  id: string;
  status: AssetStatus;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <select
      defaultValue={status}
      disabled={pending}
      onChange={(e) => {
        const next = e.currentTarget.value;
        startTransition(() => {
          updateAssetStatus(id, next);
        });
      }}
      className="border-b border-black bg-transparent text-[11px] uppercase tracking-wider font-bold focus:outline-none appearance-none cursor-pointer disabled:opacity-50"
    >
      {ASSET_STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
