export default function Loading() {
  const items = Array.from({ length: 6 });
  return (
    <main className="min-h-screen bg-black text-gray-200">
      <section className="container mx-auto px-6 py-10 sm:py-12">
        <div className="h-8 w-56 rounded bg-gray-800/60 animate-pulse" />
        <div className="mt-3 h-5 w-80 rounded bg-gray-900/60 animate-pulse" />
      </section>
      <section className="container mx-auto px-6 pb:16 sm:pb-20">
        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((_, idx) => (
            <article
              key={idx}
              className="overflow-hidden rounded-xl border border-gray-800 bg-gray-950/60 animate-pulse"
            >
              <div className="aspect-[4/3] w-full bg-gray-900" />
              <div className="p-5 sm:p-6 space-y-3">
                <div className="h-4 w-2/3 rounded bg-gray-800" />
                <div className="h-3 w-full rounded bg-gray-900" />
                <div className="h-3 w-5/6 rounded bg-gray-900" />
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}



