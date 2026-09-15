import Reveal from "@/components/ui/Reveal";

const stats = [
  ["Projects", "Organized"],
  ["Tasks", "Trackable"],
  ["Deadlines", "Visible"],
  ["Progress", "Actionable"],
];

export default function Stats() {
  return (
    <section className="py-16">
      <div className="container-shell grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(
          (
            [value, label],
            index
          ) => (
            <Reveal
              key={value}
              delay={index * 0.05}
            >
              <div className="rounded-2xl border bg-[rgb(var(--surface)/0.55)] p-6 text-center">
                <p className="text-2xl font-semibold">
                  {value}
                </p>

                <p className="mt-1 text-sm opacity-50">
                  {label}
                </p>
              </div>
            </Reveal>
          )
        )}
      </div>
    </section>
  );
}