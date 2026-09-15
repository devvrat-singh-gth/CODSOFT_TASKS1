import {
  ShieldCheck,
  Smartphone,
  Zap,
} from "lucide-react";

import Reveal from "@/components/ui/Reveal";

const benefits = [
  {
    icon: Zap,
    title: "Fast to understand",
    text: "Clear information hierarchy means you can start managing work without learning a complicated system.",
  },
  {
    icon: ShieldCheck,
    title: "Built around ownership",
    text: "Projects and tasks are tied to authenticated users and protected by backend ownership checks.",
  },
  {
    icon: Smartphone,
    title: "Works wherever you are",
    text: "Responsive layouts adapt from large desktop workspaces down to compact mobile screens.",
  },
];

export default function Benefits() {
  return (
    <section
      id="benefits"
      className="py-24 sm:py-32"
    >
      <div className="container-shell grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <Reveal>
          <div>
            <p className="text-sm font-medium text-[rgb(var(--primary))]">
              Built for everyday use
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Useful without becoming overwhelming.
            </h2>

            <p className="mt-5 max-w-lg leading-7 opacity-60">
              Every part of the interface should
              help you make a decision, update
              something, or understand progress.
            </p>
          </div>
        </Reveal>

        <div className="space-y-4">
          {benefits.map(
            (
              benefit,
              index
            ) => {
              const Icon =
                benefit.icon;

              return (
                <Reveal
                  key={benefit.title}
                  delay={
                    index * 0.07
                  }
                >
                  <div className="flex gap-5 rounded-2xl border bg-[rgb(var(--surface)/0.6)] p-6">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[rgb(var(--primary)/0.12)] text-[rgb(var(--primary))]">
                      <Icon size={20} />
                    </div>

                    <div>
                      <h3 className="font-semibold">
                        {
                          benefit.title
                        }
                      </h3>

                      <p className="mt-2 text-sm leading-6 opacity-60">
                        {
                          benefit.text
                        }
                      </p>
                    </div>
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