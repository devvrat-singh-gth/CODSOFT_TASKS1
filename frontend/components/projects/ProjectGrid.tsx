import type { Project } from "@/types/project";
import ProjectCard from "./ProjectCard";
export default function ProjectGrid({projects,onEdit,onDelete}:{projects:Project[];onEdit:(p:Project)=>void;onDelete:(p:Project)=>void}){return <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{projects.map(p=><ProjectCard key={p.id} project={p} onEdit={()=>onEdit(p)} onDelete={()=>onDelete(p)}/>)}</div>}
