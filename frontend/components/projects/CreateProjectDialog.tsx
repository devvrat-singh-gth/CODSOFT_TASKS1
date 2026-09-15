"use client";
import { createProject } from "@/services/api";
import { toast } from "sonner";
import Dialog from "@/components/ui/Dialog";
import ProjectForm from "./ProjectForm";
export default function CreateProjectDialog({open,onClose,onCreated}:{open:boolean;onClose:()=>void;onCreated:()=>void}){return <Dialog open={open} onClose={onClose} title="Create a project" description="Give the work a clear home."><ProjectForm onCancel={onClose} onSubmit={async p=>{try{await createProject(p);toast.success("Project created");onClose();onCreated()}catch(e:any){toast.error(e?.response?.data?.message||"Unable to create project")}}}/></Dialog>}
