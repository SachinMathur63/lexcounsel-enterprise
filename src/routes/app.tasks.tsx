import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Clock, User, Trash2 } from "lucide-react";
import { store, useStore, uid, type Task } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { PageHeader, Modal, Field, inputCls } from "@/components/page-header";
import { toast } from "sonner";

export const Route = createFileRoute("/app/tasks")({
  head: () => ({ meta: [{ title: "Tasks — Lex Counsel" }] }),
  component: Tasks,
});

const COLUMNS: Task["status"][] = ["Pending", "In Progress", "Completed"];

function Tasks() {
  const tasks = useStore((s) => s.tasks);
  const [open, setOpen] = useState(false);

  const move = (id: string, status: Task["status"]) =>
    store.set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? { ...t, status } : t)) }));
  const remove = (id: string) => store.set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) }));
  const add = (t: Task) => {
    store.set((s) => ({ tasks: [t, ...s.tasks] }));
    toast.success("Task added");
    setOpen(false);
  };

  return (
    <div>
      <PageHeader title="Tasks" subtitle="Kanban board for your firm's workload"
        action={<Button variant="gold" onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> New task</Button>} />

      <div className="grid gap-5 md:grid-cols-3">
        {COLUMNS.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col);
          return (
            <div key={col} className="rounded-2xl border border-border bg-card p-4">
              <div className="mb-4 flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <ColumnDot status={col} />
                  <span className="font-semibold">{col}</span>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs">{colTasks.length}</span>
                </div>
              </div>
              <div className="space-y-2.5">
                {colTasks.map((t) => (
                  <div key={t.id} className="group rounded-xl border border-border bg-background p-3.5 transition-shadow hover:shadow-elegant">
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-medium text-sm">{t.title}</div>
                      <PriPill p={t.priority} />
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><User className="h-3 w-3" />{t.assignee}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{t.deadline}</span>
                    </div>
                    <div className="mt-3 flex items-center gap-1">
                      <select value={t.status} onChange={(e) => move(t.id, e.target.value as Task["status"])}
                        className="flex-1 h-7 rounded-md border border-input bg-card text-xs px-2 focus:outline-none focus:ring-1 focus:ring-gold">
                        {COLUMNS.map((c) => <option key={c}>{c}</option>)}
                      </select>
                      <button onClick={() => remove(t.id)} className="rounded p-1 text-destructive opacity-0 transition-opacity hover:bg-destructive/10 group-hover:opacity-100"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </div>
                ))}
                {colTasks.length === 0 && <div className="rounded-xl border border-dashed border-border py-8 text-center text-xs text-muted-foreground">No tasks</div>}
              </div>
            </div>
          );
        })}
      </div>

      <AddTask open={open} onClose={() => setOpen(false)} onSave={add} />
    </div>
  );
}

function ColumnDot({ status }: { status: Task["status"] }) {
  const map = { Pending: "bg-muted-foreground", "In Progress": "bg-gold", Completed: "bg-success" } as const;
  return <span className={`h-2 w-2 rounded-full ${map[status]}`} />;
}
function PriPill({ p }: { p: string }) {
  const map: Record<string, string> = { Low: "bg-muted text-muted-foreground", Medium: "bg-info/15 text-info", High: "bg-destructive/15 text-destructive" };
  return <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${map[p]}`}>{p}</span>;
}

function AddTask({ open, onClose, onSave }: { open: boolean; onClose: () => void; onSave: (t: Task) => void }) {
  const [form, setForm] = useState<Task>({ id: uid(), title: "", assignee: "You", status: "Pending", deadline: new Date().toISOString().slice(0, 10), priority: "Medium" });
  return (
    <Modal open={open} onClose={onClose} title="New task">
      <form onSubmit={(e) => { e.preventDefault(); if (!form.title) return; onSave({ ...form, id: uid() }); }} className="space-y-4">
        <Field label="Title"><input className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Assignee"><input className={inputCls} value={form.assignee} onChange={(e) => setForm({ ...form, assignee: e.target.value })} /></Field>
          <Field label="Deadline"><input type="date" className={inputCls} value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} /></Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Priority">
            <select className={inputCls} value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as Task["priority"] })}>
              <option>Low</option><option>Medium</option><option>High</option>
            </select>
          </Field>
          <Field label="Status">
            <select className={inputCls} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Task["status"] })}>
              {COLUMNS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>
        </div>
        <div className="flex justify-end gap-2"><Button type="button" variant="ghost" onClick={onClose}>Cancel</Button><Button type="submit" variant="gold">Add task</Button></div>
      </form>
    </Modal>
  );
}
