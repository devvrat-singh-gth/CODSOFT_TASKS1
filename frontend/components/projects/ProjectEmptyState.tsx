import { FolderPlus } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
export default function ProjectEmptyState({onCreate}:{onCreate:()=>void}){return <EmptyState icon={<FolderPlus size={21}/>} title="No projects yet" description="Start with one project and use tasks, priorities, and deadlines to keep the work moving." action={<Button onClick={onCreate}>Create project</Button>}/>}
