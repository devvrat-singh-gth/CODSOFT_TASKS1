export function AdminStats({ stats }: { stats: { label: string; value: string | number }[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="rounded-xl border border-border p-4">
          <p className="text-xs text-foreground/50">{s.label}</p>
          <p className="mt-1 text-2xl font-semibold">{s.value}</p>
        </div>
      ))}
    </div>
  );
}
