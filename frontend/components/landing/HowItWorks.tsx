import Reveal from "@/components/ui/Reveal";

const steps = [
  {
    number: "01",
    title: "Create your workspace",
    description:
      "Create projects around the work you actually need to manage.",
  },
  {
    number: "02",
    title: "Break work into tasks",
    description:
      "Set priorities, deadlines, descriptions, status, and assignments.",
  },
  {
    number: "03",
    title: "Track progress",
    description:
      "Use filters, pagination, project progress, and dashboard insights to stay on top of the work.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="border-y py-24 sm:py-32"
    >
      <div className="container-shell">
        <Reveal>
          <div className="max-w-xl">
            <p className="text-sm font-medium text-[rgb(var(--primary))]">
              How it works
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              From idea to done in three steps.
            </h2>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {steps.map(
            (
              step,
              index
            ) => (
              <Reveal
                key={step.number}
                delay={
                  index * 0.08
                }
              >
                <div className="relative">
                  <span className="text-sm font-semibold text-[rgb(var(--primary))]">
                    {step.number}
                  </span>

                  <h3 className="mt-4 text-xl font-semibold">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 opacity-60">
                    {
                      step.description
                    }
                  </p>

                  {index <
                    steps.length -
                      1 && (
                    <div className="absolute right-0 top-2 hidden h-px w-1/3 bg-[rgb(var(--border))] md:block" />
                  )}
                </div>
              </Reveal>
            )
          )}
        </div>
      </div>
    </section>
  );
}