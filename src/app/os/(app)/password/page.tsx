import { PageHeader, PrimaryButton, Section } from "../../_components/ui";
import { updateCurrentPassword } from "./actions";

export default async function PasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div>
      <PageHeader
        title="Set Password"
        eyebrow="Choose a password for regular Heard OS login"
      />

      <Section label="Password">
        <form action={updateCurrentPassword}>
          <label className="block py-2">
            <span className="font-bold uppercase tracking-wider text-xs">
              Password
            </span>
            <input
              type="password"
              name="password"
              required
              minLength={8}
              autoComplete="new-password"
              className="mt-1 w-full border-b-2 border-black bg-transparent py-1.5 text-sm focus:outline-none"
            />
          </label>
          <label className="block py-2">
            <span className="font-bold uppercase tracking-wider text-xs">
              Confirm Password
            </span>
            <input
              type="password"
              name="confirm_password"
              required
              minLength={8}
              autoComplete="new-password"
              className="mt-1 w-full border-b-2 border-black bg-transparent py-1.5 text-sm focus:outline-none"
            />
          </label>
          <PrimaryButton>Save Password</PrimaryButton>
          {error ? (
            <p className="font-bold uppercase tracking-wider text-xs pt-3">
              {error === "password_short"
                ? "Password must be at least 8 characters."
                : error === "password_mismatch"
                  ? "Passwords do not match."
                  : "Password could not be updated. Try the reset link again."}
            </p>
          ) : null}
        </form>
      </Section>
    </div>
  );
}
