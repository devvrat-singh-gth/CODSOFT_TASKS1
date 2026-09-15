"use client";
import { updateProject } from "@/services/api";
import { toast } from "sonner";
import Dialog from "@/components/ui/Dialog";
import ProjectForm from "./ProjectForm";
import type { Project } from "@/types/project";
export default function EditProjectDialog({project,onClose,onUpdated}:{project:Project|null;onClose:()=>void;onUpdated:()=>void}){return <Dialog open={Boolean(project)} onClose={onClose} title="Edit project" description="Keep the project context current."><ProjectForm initial={project||undefined} onCancel={onClose} onSubmit={async p=>{if(!project)return;try{await updateProject(project.id,p);toast.success("Project updated");onClose();onUpdated()}catch(e:any){toast.error(e?.response?.data?.message||"Unable to update project")}}}/></Dialog>}
