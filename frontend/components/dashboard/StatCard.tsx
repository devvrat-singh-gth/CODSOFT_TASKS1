import type {
  LucideIcon,
} from "lucide-react";

interface Props {
  title: string;
  value: number;
  hint: string;
  icon: LucideIcon;
  tone?: "default" | "warning";
}

export default function StatCard({
  title,
  value,
  hint,
  icon: Icon,
  tone = "default",
}: Props) {
  return (
    <div className="group rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5">
      <div className="flex items-start justify-between">
        <div
          className={[
            "grid h-10 w-10 place-items-center rounded-xl",
            tone === "warning"
              ? "bg-[rgb(var(--danger)/0.1)] text-[rgb(var(--danger))]"
              : "bg-[rgb(var(--primary)/0.1)] text-[rgb(var(--primary))]",
          ].join(" ")}
        >
          <Icon size={19} />
        </div>

        <span className="text-3xl font-semibold tracking-tight">
          {value}
        </span>
      </div>

      <p className="mt-5 text-sm font-medium">
        {title}
      </p>

      <p className="mt-1 text-xs text-[rgb(var(--muted))]">
        {hint}
      </p>
    </div>
  );
}