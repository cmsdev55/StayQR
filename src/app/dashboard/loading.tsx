/** Skeleton while a dashboard route loads: same frame, quiet shimmer. */
export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading" className="flex flex-col gap-6">
      <div className="skeleton h-8 w-48 rounded-sm" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => <div key={i} className="skeleton h-28 rounded-md" />)}
      </div>
      <div className="skeleton h-80 rounded-md" />
    </div>
  );
}
