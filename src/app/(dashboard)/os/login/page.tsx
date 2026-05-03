export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; sent?: string }>;
}) {
  const params = await searchParams;
  const sent = params.sent === "1";
  const error = params.error;

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

        {sent ? (
          <div className="space-y-4">
            <p className="font-bold uppercase tracking-wider text-xs">
              Check your email
            </p>
            <p className="text-sm leading-relaxed">
              If your address is authorized, a sign-in link has been sent. Open
              it on this device.
            </p>
            <a
              href="/os/login"
              className="inline-block mt-2 font-bold uppercase tracking-wider text-xs underline"
            >
              Back
            </a>
          </div>
        ) : (
          <form action="/os/login/send" method="post" className="space-y-2">
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
            <button
              type="submit"
              className="w-full border-t-2 border-b-2 border-black py-3 mt-6 font-bold uppercase tracking-wider text-sm hover:bg-black hover:text-white transition-colors"
            >
              Send Link
            </button>
            {error ? (
              <p className="font-bold uppercase tracking-wider text-xs pt-3">
                {error === "unauthorized"
                  ? "Access denied. This email is not authorized."
                  : "Sign-in failed. Try again."}
              </p>
            ) : null}
          </form>
        )}
      </div>
    </main>
  );
}
