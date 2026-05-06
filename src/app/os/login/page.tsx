import { OS_USERS } from "@/lib/os/users";
import { sendMagicLink, setUpPassword, signInWithPassword } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string;
    mode?: string;
    sent?: string;
    setup?: string;
  }>;
}) {
  const params = await searchParams;
  const mode = params.mode === "setup" || params.mode === "magic" ? params.mode : "login";
  const sent = params.sent === "1";
  const setup = params.setup === "1";
  const error = params.error;
  const action =
    mode === "setup"
      ? setUpPassword
      : mode === "magic"
        ? sendMagicLink
        : signInWithPassword;
  const button =
    mode === "setup"
      ? "Set Password"
      : mode === "magic"
        ? "Send Magic Link"
        : "Sign In";

  return (
    <main className="min-h-screen flex items-start justify-center px-6 pt-24 pb-12">
      <div className="w-full max-w-sm">
        <div className="border-t-4 border-b-4 border-black py-3 mb-8">
          <h1 className="font-bold uppercase tracking-wider text-base">
            Heard OS
          </h1>
          <p className="text-xs uppercase tracking-wider mt-1">
            Private. Authorized access only.
          </p>
        </div>

        {sent || setup ? (
          <div className="space-y-4">
            <p className="font-bold uppercase tracking-wider text-xs">
              {setup ? "Password setup started" : "Check your email"}
            </p>
            <p className="text-sm leading-relaxed">
              {setup
                ? "If Supabase requires email confirmation, open the confirmation email once. After that, use regular email and password sign-in."
                : "If your address is authorized, a sign-in link has been sent. Open it on this device."}
            </p>
            <a
              href="/os/login"
              className="inline-block mt-2 font-bold uppercase tracking-wider text-xs underline"
            >
              Back
            </a>
          </div>
        ) : (
          <form action={action} className="space-y-2">
            <div className="mb-5 flex flex-wrap gap-x-5 gap-y-2 font-bold uppercase tracking-wider text-xs">
              <a
                href="/os/login"
                className={mode === "login" ? "underline" : "hover:underline"}
              >
                Password Login
              </a>
              <a
                href="/os/login?mode=setup"
                className={mode === "setup" ? "underline" : "hover:underline"}
              >
                Set Password
              </a>
              <a
                href="/os/login?mode=magic"
                className={mode === "magic" ? "underline" : "hover:underline"}
              >
                Magic Link
              </a>
            </div>

            {mode === "setup" ? (
              <div className="mb-4 border-t-2 border-b-2 border-black py-3">
                <p className="font-bold uppercase tracking-wider text-xs">
                  Authorized accounts
                </p>
                <ul className="mt-2 space-y-1 font-mono text-[11px] uppercase tracking-wider">
                  {OS_USERS.map((user) => (
                    <li key={user.email}>
                      {user.name}: {user.email}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <label className="block">
              <span className="font-bold uppercase tracking-wider text-xs">
                Email
              </span>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                autoFocus
                className="mt-2 w-full border-b-2 border-black bg-transparent py-2 text-base focus:outline-none"
              />
            </label>

            {mode !== "magic" ? (
              <label className="block pt-2">
                <span className="font-bold uppercase tracking-wider text-xs">
                  Password
                </span>
                <input
                  type="password"
                  name="password"
                  required
                  minLength={8}
                  autoComplete={mode === "setup" ? "new-password" : "current-password"}
                  className="mt-2 w-full border-b-2 border-black bg-transparent py-2 text-base focus:outline-none"
                />
              </label>
            ) : null}

            {mode === "setup" ? (
              <label className="block pt-2">
                <span className="font-bold uppercase tracking-wider text-xs">
                  Confirm Password
                </span>
                <input
                  type="password"
                  name="confirm_password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="mt-2 w-full border-b-2 border-black bg-transparent py-2 text-base focus:outline-none"
                />
              </label>
            ) : null}

            <button
              type="submit"
              className="w-full border-t-2 border-b-2 border-black py-3 mt-6 font-bold uppercase tracking-wider text-sm hover:bg-black hover:text-white transition-colors"
            >
              {button}
            </button>
            {error ? (
              <p className="font-bold uppercase tracking-wider text-xs pt-3">
                {error === "not_allowed"
                  ? "Access denied. This email is not authorized."
                  : error === "config"
                    ? "Dashboard configuration is missing. Check Vercel environment variables."
                  : error === "password_short"
                    ? "Password must be at least 8 characters."
                  : error === "password_mismatch"
                    ? "Passwords do not match."
                  : error === "already_registered"
                    ? "This account already exists. Use Password Login."
                  : "Sign-in failed. Try again."}
              </p>
            ) : null}
          </form>
        )}
      </div>
    </main>
  );
}
