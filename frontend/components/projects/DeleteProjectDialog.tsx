"use client";
import { deleteProject } from "@/services/api";
import { toast } from "sonner";
import Dialog from "@/components/ui/Dialog";
import Button from "@/components/ui/Button";
import type { Project } from "@/types/project";
export default function DeleteProjectDialog({project,onClose,onDeleted}:{project:Project|null;onClose:()=>void;onDeleted:()=>void}){return <Dialog open={Boolean(project)} onClose={onClose} title="Delete project" description="This action cannot be undone."><p className="text-sm leading-6 text-[rgb(var(--muted))]">Delete <strong className="text-[rgb(var(--foreground))]">{project?.title}</strong> and its tasks?</p><div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><Button variant="ghost" onClick={onClose}>Cancel</Button><Button variant="danger" onClick={async()=>{if(!project)return;try{await deleteProject(project.id);toast.success("Project deleted");onClose();onDeleted()}catch(e:any){toast.error(e?.response?.data?.message||"Unable to delete project")}}}>Delete project</Button></div></Dialog>}
