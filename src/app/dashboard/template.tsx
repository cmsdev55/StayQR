/** Route change: a 150ms fade, nothing more (DESIGN.md §8). */
export default function DashboardTemplate({ children }: { children: React.ReactNode }) {
  return <div className="route-fade">{children}</div>;
}
