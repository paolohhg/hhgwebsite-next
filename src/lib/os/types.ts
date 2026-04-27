export type Brand =
  | "HHG"
  | "LASA"
  | "Mels-Table"
  | "Revenue-Infrastructure"
  | "Heard-Kitchen"
  | "ContractForge"
  | "Heard-OS"
  | "BIB"
  | "Fit-Kitchen";

export type ProjectStatus = "active" | "pilot" | "dormant" | "shipped";
export type RevenueTier = "producing" | "near-term" | "long-term";
export type Owner = "Paolo" | "Mel" | "Both";
export type TaskAssignee = "Paolo" | "Mel";
export type TaskStatus = "open" | "doing" | "done";
export type AssetCategory =
  | "product"
  | "service"
  | "content"
  | "template"
  | "tool";
export type AssetStatus = "ready-to-sell" | "needs-work" | "dormant" | "sold";

export const BRANDS: Brand[] = [
  "HHG",
  "LASA",
  "Mels-Table",
  "Revenue-Infrastructure",
  "Heard-Kitchen",
  "ContractForge",
  "Heard-OS",
  "BIB",
  "Fit-Kitchen",
];
export const PROJECT_STATUSES: ProjectStatus[] = [
  "active",
  "pilot",
  "dormant",
  "shipped",
];
export const REVENUE_TIERS: RevenueTier[] = [
  "producing",
  "near-term",
  "long-term",
];
export const OWNERS: Owner[] = ["Paolo", "Mel", "Both"];
export const TASK_ASSIGNEES: TaskAssignee[] = ["Paolo", "Mel"];
export const TASK_STATUSES: TaskStatus[] = ["open", "doing", "done"];
export const ASSET_CATEGORIES: AssetCategory[] = [
  "product",
  "service",
  "content",
  "template",
  "tool",
];
export const ASSET_STATUSES: AssetStatus[] = [
  "ready-to-sell",
  "needs-work",
  "dormant",
  "sold",
];

export type Project = {
  id: string;
  name: string;
  description: string | null;
  brand: Brand;
  status: ProjectStatus;
  revenue_tier: RevenueTier | null;
  owner: Owner;
  next_action: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Task = {
  id: string;
  project_id: string | null;
  title: string;
  assignee: TaskAssignee;
  due_date: string | null;
  status: TaskStatus;
  notes: string | null;
  created_at: string;
  completed_at: string | null;
};

export type Asset = {
  id: string;
  name: string;
  category: AssetCategory;
  brand: Brand;
  status: AssetStatus;
  drive_url: string | null;
  notes: string | null;
  created_at: string;
};
