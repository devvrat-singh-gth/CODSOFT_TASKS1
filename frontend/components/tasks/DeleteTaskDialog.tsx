"use client";
import Dialog from "@/components/ui/Dialog";
import Button from "@/components/ui/Button";
import { deleteTask } from "@/services/api";
import { toast } from "sonner";
import type { Task } from "@/types/task";
export default function DeleteTaskDialog({task,onClose,onDeleted}:{task:Task|null;onClose:()=>void;onDeleted:()=>void}){return <Dialog open={Boolean(task)} onClose={onClose} title="Delete task" description="This action cannot be undone."><p className="text-sm leading-6 text-[rgb(var(--muted))]">Delete <strong className="text-[rgb(var(--foreground))]">{task?.title}</strong>?</p><div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><Button variant="ghost" onClick={onClose}>Cancel</Button><Button variant="danger" onClick={async()=>{if(!task)return;try{await deleteTask(task.id);toast.success("Task deleted");onClose();onDeleted()}catch(e:any){toast.error(e?.response?.data?.message||"Unable to delete task")}}}>Delete task</Button></div></Dialog>}
