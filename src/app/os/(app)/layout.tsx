import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/os/login");

  const allowlist = (process.env.ALLOWED_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  if (!user.email || !allowlist.includes(user.email.toLowerCase())) {
    await supabase.auth.signOut();
    redirect("/os/login?error=not_allowed");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-t-4 border-b-4 border-black">
        <div className="max-w-3xl mx-auto px-6 py-3 flex items-baseline justify-between gap-4">
          <Link
            href="/os"
            className="font-bold uppercase tracking-wider text-sm"
          >
            Heard OS
          </Link>
          <span className="font-mono text-xs truncate">{user.email}</span>
        </div>
        <nav className="border-t-2 border-black">
          <ul className="max-w-3xl mx-auto px-6 flex flex-wrap items-baseline gap-x-6 gap-y-1 py-2 font-bold uppercase tracking-wider text-xs">
            <li>
              <Link href="/os" className="hover:underline">
                Overview
              </Link>
            </li>
            <li>
              <Link href="/os/projects" className="hover:underline">
                Projects
              </Link>
            </li>
            <li>
              <Link href="/os/tasks" className="hover:underline">
                Tasks
              </Link>
            </li>
            <li>
              <Link href="/os/assets" className="hover:underline">
                Assets
              </Link>
            </li>
            <li className="ml-auto">
              <form action={signOut}>
                <button
                  type="submit"
                  className="font-bold uppercase tracking-wider text-xs underline hover:no-underline"
                >
                  Sign Out
                </button>
              </form>
            </li>
          </ul>
        </nav>
      </header>
      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-8">
        {children}
      </main>
      <footer className="border-t-4 border-black mt-12 py-3">
        <p className="max-w-3xl mx-auto px-6 font-bold uppercase tracking-wider text-[10px]">
          Heard Hospitality Group · Internal · Not for distribution
        </p>
      </footer>
    </div>
  );
}
