import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center bg-surface px-4 py-16">
      <div className="w-full max-w-lg rounded-xl border bg-white p-8 text-center shadow-sm sm:p-10">
        <p className="text-6xl font-bold tracking-tight text-navy">404</p>
        <h1 className="mt-3 text-2xl font-semibold text-navy">Page not found</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          The page you are looking for does not exist or has been moved.
        </p>
        <Button asChild className="mt-6">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </main>
  );
}
