import { sendMagicLink, setUpPassword, signInWithPassword } from "./actions";

const modeCopy = {
  login: {
    title: "Sign in",
    body: "Use your Heard OS email and password.",
  },
  setup: {
    title: "Set password",
    body: "Use your HHG email and choose a private password.",
  },
  magic: {
    title: "Magic link",
    body: "Send a one-time link if password sign-in is not available.",
  },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string;
    mode?: string;
    password_set?: string;
    reset?: string;
    sent?: string;
    setup?: string;
  }>;
}) {
  const params = await searchParams;
  const mode = params.mode === "setup" || params.mode === "magic" ? params.mode : "login";
  const passwordSet = params.password_set === "1";
  const reset = params.reset === "1";
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
  const copy = modeCopy[mode];

  return (
    <main className="min-h-screen flex items-start justify-center px-6 pt-16 pb-12 sm:pt-24">
      <div className="w-full max-w-md">
        <div className="border-t-4 border-b-4 border-black py-4 mb-6">
          <h1 className="font-bold uppercase tracking-wider text-base">
            Heard OS
          </h1>
          <p className="text-xs uppercase tracking-wider mt-1">
            Private. Authorized access only.
          </p>
        </div>

        {sent || setup || passwordSet || reset ? (
          <div className="border-b-2 border-black pb-5 space-y-4">
            <p className="font-bold uppercase tracking-wider text-xs">
              {passwordSet
                ? "Password set"
                : reset
                  ? "Check your email"
                  : setup
                    ? "Password setup started"
                    : "Check your email"}
            </p>
            <p className="text-sm leading-relaxed">
              {passwordSet
                ? "Your password is ready. Go back and sign in with your HHG email."
                : reset
                  ? "This account already exists. Open the password reset email once, set your password there, then use regular password login."
                  : setup
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
          <form action={action}>
            <div className="grid grid-cols-3 border-t-2 border-l-2 border-black mb-6 font-bold uppercase tracking-wider text-[10px] sm:text-xs">
              <a
                href="/os/login"
                className={`border-r-2 border-b-2 border-black px-2 py-2 text-center ${
                  mode === "login" ? "bg-black text-white" : "hover:underline"
                }`}
              >
                Login
              </a>
              <a
                href="/os/login?mode=setup"
                className={`border-r-2 border-b-2 border-black px-2 py-2 text-center ${
                  mode === "setup" ? "bg-black text-white" : "hover:underline"
                }`}
              >
                Set Password
              </a>
              <a
                href="/os/login?mode=magic"
                className={`border-r-2 border-b-2 border-black px-2 py-2 text-center ${
                  mode === "magic" ? "bg-black text-white" : "hover:underline"
                }`}
              >
                Magic Link
              </a>
            </div>

            <div className="border-b-2 border-black pb-4 mb-4">
              <p className="font-bold uppercase tracking-wider text-xs">
                {copy.title}
              </p>
              <p className="mt-2 text-sm leading-relaxed">{copy.body}</p>
            </div>

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
                  autoComplete={
                    mode === "setup" ? "new-password" : "current-password"
                  }
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
                  : error === "email_not_confirmed"
                    ? "Email is not confirmed yet. Check the confirmation email once, then sign in again."
                  : error === "invalid_credentials"
                    ? "Password login is not ready for this account yet, or the password is incorrect. Use Set Password first."
                  : error === "password_short"
                    ? "Password must be at least 8 characters."
                  : error === "password_mismatch"
                    ? "Passwords do not match."
                  : error === "already_registered"
                    ? "This account already exists. Use Password Login."
                  : error === "reset_failed"
                    ? "Password reset email could not be sent. Check Supabase auth settings."
                  : error === "admin_failed"
                    ? "Admin password setup failed. Check the Supabase service role key."
                  : "Sign-in failed. Try again."}
              </p>
            ) : null}
          </form>
        )}
      </div>
    </main>
  );
}
