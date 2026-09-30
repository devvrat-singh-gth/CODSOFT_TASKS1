export function AdminHeader({ title }: { title: string }) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <h1 className="text-xl font-semibold">{title}</h1>
    </div>
  );
}
