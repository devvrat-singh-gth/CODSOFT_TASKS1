import {
  CalendarClock,
  CheckCircle2,
  FolderKanban,
  ListFilter,
  Search,
  Users,
} from "lucide-react";

import Reveal from "@/components/ui/Reveal";

const features = [
  {
    icon: FolderKanban,
    title: "Project organization",
    description:
      "Keep every project, task, deadline, and progress state in one focused workspace.",
  },
  {
    icon: CheckCircle2,
    title: "Task management",
    description:
      "Track status, priorities, descriptions, assignments, and completion without unnecessary complexity.",
  },
  {
    icon: CalendarClock,
    title: "Deadline visibility",
    description:
      "Know what is due, what is overdue, and what needs attention at a glance.",
  },
  {
    icon: ListFilter,
    title: "Fast filtering",
    description:
      "Find tasks quickly with search, status, priority, and pagination.",
  },
  {
    icon: Search,
    title: "Focused workflow",
    description:
      "Move from planning to execution without drowning in menus and configuration.",
  },
  {
    icon: Users,
    title: "Account-based workspace",
    description:
      "Each account gets its own projects and tasks with backend authorization protecting the data.",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="py-24 sm:py-32"
    >
      <div className="container-shell">
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-[rgb(var(--primary))]">
              Everything you need
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              A focused workspace for getting things done.
            </h2>

            <p className="mt-4 leading-7 opacity-65">
              The important project-management
              features are easy to reach, while
              the interface stays out of your way.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(
            (
              feature,
              index
            ) => {
              const Icon =
                feature.icon;

              return (
                <Reveal
                  key={feature.title}
                  delay={
                    index * 0.06
                  }
                >
                  <div className="group h-full rounded-2xl border bg-[rgb(var(--surface)/0.65)] p-6 transition duration-300 hover:-translate-y-1 hover:bg-[rgb(var(--surface))]">
                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-[rgb(var(--primary)/0.12)] text-[rgb(var(--primary))]">
                      <Icon size={20} />
                    </div>

                    <h3 className="mt-6 text-lg font-semibold">
                      {feature.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 opacity-60">
                      {
                        feature.description
                      }
                    </p>
                  </div>
                </Reveal>
              );
            }
          )}
        </div>
      </div>
    </section>
  );
}