export const OS_USERS = [
  {
    name: "Paolo",
    email: "paolo@heardhospitalitygroup.com",
  },
  {
    name: "Chef Mel",
    email: "chefmel@heardhospitalitygroup.com",
  },
] as const;

export function getAllowedOsEmails() {
  const configured = (process.env.ALLOWED_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  if (configured.length > 0) return configured;

  return OS_USERS.map((user) => user.email);
}

export function isAllowedOsEmail(email: string) {
  return getAllowedOsEmails().includes(email.trim().toLowerCase());
}
