import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";
import { isAllowedOsEmail } from "@/lib/os/users";

const navItems = [
  { href: "/os", label: "Command Center", meta: "today / next / stale" },
  { href: "/os/calendar", label: "Calendar", meta: "dated work" },
  { href: "/os/projects", label: "Projects", meta: "active work" },
  { href: "/os/tasks", label: "Tasks", meta: "owner load" },
  { href: "/os/assets", label: "Assets", meta: "ready to sell" },
];

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

  if (!user.email || !isAllowedOsEmail(user.email)) {
    await supabase.auth.signOut();
    redirect("/os/login?error=not_allowed");
  }

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="hidden lg:flex min-h-screen flex-col border-r-4 border-black">
        <div className="border-t-4 border-b-4 border-black px-5 py-4">
          <Link
            href="/os"
            className="font-bold uppercase tracking-wider text-sm"
          >
            Heard OS
          </Link>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-wider break-all">
            {user.email}
          </p>
        </div>

        <nav className="flex-1 px-5 py-5">
          <p className="mb-3 font-bold uppercase tracking-wider text-[10px]">
            Project Management
          </p>
          <ul className="space-y-0 border-t-2 border-black">
            {navItems.map((item) => (
              <li key={item.href} className="border-b border-black/30">
                <Link
                  href={item.href}
                  className="block py-3 hover:underline"
                >
                  <span className="block font-bold uppercase tracking-wider text-xs">
                    {item.label}
                  </span>
                  <span className="block font-mono text-[10px] uppercase tracking-wider">
                    {item.meta}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t-4 border-black px-5 py-4">
          <form action={signOut}>
            <button
              type="submit"
              className="font-bold uppercase tracking-wider text-xs underline hover:no-underline"
            >
              Sign Out
            </button>
          </form>
          <p className="mt-5 font-bold uppercase tracking-wider text-[10px] leading-relaxed">
            Heard Hospitality Group · Internal · Not for distribution
          </p>
        </div>
      </aside>

      <div className="min-h-screen flex flex-col">
        <header className="lg:hidden border-t-4 border-b-4 border-black">
          <div className="px-6 py-3 flex items-baseline justify-between gap-4">
            <Link
              href="/os"
              className="font-bold uppercase tracking-wider text-sm"
            >
              Heard OS
            </Link>
            <span className="font-mono text-xs truncate">{user.email}</span>
          </div>
          <nav className="border-t-2 border-black">
            <ul className="px-6 flex flex-wrap items-baseline gap-x-5 gap-y-1 py-2 font-bold uppercase tracking-wider text-xs">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:underline">
                    {item.label === "Command Center" ? "Home" : item.label}
                  </Link>
                </li>
              ))}
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

        <main className="flex-1 max-w-4xl w-full px-6 py-8 lg:px-10">
          {children}
        </main>
        <footer className="lg:hidden border-t-4 border-black mt-12 py-3">
          <p className="px-6 font-bold uppercase tracking-wider text-[10px]">
          Heard Hospitality Group · Internal · Not for distribution
          </p>
        </footer>
      </div>
    </div>
  );
}
