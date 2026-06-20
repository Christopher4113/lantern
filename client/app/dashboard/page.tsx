import { Lamp } from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";
import { SignOutButton } from "@/components/auth/sign-out-button";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="relative min-h-screen overflow-hidden bg-navy-900 text-slate-100">
      <div className="mesh-bg absolute inset-0" />
      <div className="noise-overlay pointer-events-none absolute inset-0" />

      <div className="relative mx-auto max-w-4xl px-6 py-10">
        <header className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/20 ring-1 ring-gold-500/30">
              <Lamp className="h-4 w-4 text-gold-400" />
            </div>
            <span className="text-base font-semibold tracking-tight">Lantern</span>
          </Link>
          <SignOutButton />
        </header>

        <main className="mt-16">
          <p className="section-label">Dashboard</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
            Welcome{session?.user?.name ? `, ${session.user.name}` : ""}
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-500">
            You&apos;re signed in as{" "}
            <span className="text-gold-300">{session?.user?.email}</span>. Your
            insider trade feed will appear here.
          </p>

          <div className="glass-card mt-10 rounded-2xl p-6 md:p-8">
            <p className="text-sm text-zinc-400">
              Feed and alerts are coming soon. For now, this confirms auth is
              working end-to-end.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
