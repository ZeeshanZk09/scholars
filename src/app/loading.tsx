export default function Loading() {
  return (
    <main
      className="min-h-[60vh] bg-surface px-4 py-5 sm:px-6 sm:py-8 lg:px-8"
      aria-label="Loading page"
      role="status"
    >
      <div className="mx-auto w-full max-w-6xl space-y-6 sm:space-y-8">
        <span className="sr-only">Loading page</span>
        <header className="flex items-center justify-between gap-4 rounded-xl border bg-white px-4 py-3 shadow-sm sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="size-9 shrink-0 animate-pulse rounded-lg bg-slate-200 sm:size-11" />
            <div className="h-4 w-28 animate-pulse rounded bg-slate-200 sm:w-40" />
          </div>
          <div className="hidden items-center gap-3 sm:flex">
            <div className="h-3 w-16 animate-pulse rounded bg-slate-200" />
            <div className="h-3 w-20 animate-pulse rounded bg-slate-200" />
            <div className="h-9 w-24 animate-pulse rounded-md bg-slate-200" />
          </div>
          <div className="h-8 w-8 animate-pulse rounded-md bg-slate-200 sm:hidden" />
        </header>

        <section className="grid overflow-hidden rounded-2xl border bg-white shadow-sm md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5 p-5 sm:p-8 lg:p-10">
            <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
            <div className="space-y-3">
              <div className="h-8 w-full max-w-lg animate-pulse rounded-md bg-slate-200 sm:h-10" />
              <div className="h-8 w-4/5 max-w-md animate-pulse rounded-md bg-slate-200 sm:h-10" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full max-w-xl animate-pulse rounded bg-slate-200" />
              <div className="h-3 w-11/12 max-w-lg animate-pulse rounded bg-slate-200" />
              <div className="h-3 w-2/3 max-w-sm animate-pulse rounded bg-slate-200" />
            </div>
            <div className="h-10 w-32 animate-pulse rounded-md bg-slate-200" />
          </div>
          <div className="min-h-48 animate-pulse bg-slate-200 md:min-h-full" />
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="h-6 w-36 animate-pulse rounded-md bg-slate-200 sm:w-48" />
            <div className="h-3 w-16 animate-pulse rounded bg-slate-200" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <article key={item} className="overflow-hidden rounded-xl border bg-white shadow-sm">
                <div className="aspect-video animate-pulse bg-slate-200" />
                <div className="space-y-3 p-4 sm:p-5">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
                  <div className="h-3 w-full animate-pulse rounded bg-slate-200" />
                  <div className="h-3 w-5/6 animate-pulse rounded bg-slate-200" />
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
