import type { Task } from "@/types/task";
import TaskCard from "./TaskCard";

export default function TaskList({tasks,onEdit,onDelete,onStatusChange}:{tasks:Task[];onEdit:(t:Task)=>void;onDelete:(t:Task)=>void;onStatusChange:(t:Task,s:Task["status"])=>void}){
  return <div className="grid gap-3 md:grid-cols-2 lg:hidden">{tasks.map(t=><TaskCard key={t.id} task={t} onEdit={()=>onEdit(t)} onDelete={()=>onDelete(t)} onStatusChange={s=>onStatusChange(t,s)}/>)}</div>;
}
