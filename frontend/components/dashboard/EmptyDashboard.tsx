import { ArrowRight, Rocket } from "lucide-react";
import Link from "next/link";
import EmptyState from "@/components/ui/EmptyState";
export default function EmptyDashboard(){return <EmptyState icon={<Rocket size={21}/>} title="Your workspace is ready for its first project" description="Create a project, add a few tasks, and WorkOrbit will turn the dashboard into a live overview." action={<Link href="/projects" className="inline-flex items-center gap-2 rounded-xl bg-[rgb(var(--primary))] px-4 py-2.5 text-sm font-semibold text-[rgb(var(--primary-foreground))]">Create a project <ArrowRight size={15}/></Link>}/>}
