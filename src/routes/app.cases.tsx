import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { store, useStore, uid, type Case } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { PageHeader, Modal, Field, inputCls } from "@/components/page-header";
import { toast } from "sonner";

export const Route = createFileRoute("/app/cases")({
  head: () => ({ meta: [{ title: "Cases — Lex Counsel" }] }),
  component: Cases,
});

const STATUSES = ["Open", "In Progress", "On Hold", "Closed"] as const;
const PRIORITIES = ["Low", "Medium", "High", "Critical"] as const;

function Cases() {
  const cases = useStore((s) => s.cases);
  const clients = useStore((s) => s.clients);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<string>("All");
  const [editing, setEditing] = useState<Case | null>(null);
  const [open, setOpen] = useState(false);

  const filtered = cases
    .filter((c) => filter === "All" || c.status === filter)
    .filter((c) => [c.title, c.number, c.opposingParty, c.court].join(" ").toLowerCase().includes(q.toLowerCase()));

  const save = (c: Case) => {
    store.set((s) => ({
      cases: editing ? s.cases.map((x) => (x.id === c.id ? c : x)) : [c, ...s.cases],
    }));
    toast.success(editing ? "Case updated" : "Case created");
    setOpen(false); setEditing(null);
  };
  const remove = (id: string) => {
    store.set((s) => ({ cases: s.cases.filter((c) => c.id !== id) }));
    toast.success("Case removed");
  };

  return (
    <div>
      <PageHeader title="Cases" subtitle="Track lifecycle from open to closed"
        action={<Button variant="gold" onClick={() => { setEditing(null); setOpen(true); }}><Plus className="h-4 w-4" /> New case</Button>} />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search cases..." className="h-10 w-full rounded-lg border border-input bg-muted/40 pl-10 pr-3 text-sm focus:bg-background focus:outline-none focus:ring-2 focus:ring-gold" />
        </div>
        <div className="flex gap-1.5">
          {["All", ...STATUSES].map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${filter === s ? "gradient-gold text-gold-foreground" : "border border-border bg-card hover:bg-accent"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-5 py-3 text-left">Case</th>
              <th className="px-5 py-3 text-left">Client</th>
              <th className="px-5 py-3 text-left">Court</th>
              <th className="px-5 py-3 text-left">Priority</th>
              <th className="px-5 py-3 text-left">Status</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => {
              const client = clients.find((x) => x.id === c.clientId);
              return (
                <tr key={c.id} className="border-t border-border hover:bg-muted/30">
                  <td className="px-5 py-3.5">
                    <div className="font-medium">{c.title}</div>
                    <div className="text-xs text-muted-foreground">{c.number} · vs {c.opposingParty}</div>
                  </td>
                  <td className="px-5 py-3.5">{client?.name || "—"}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{c.court}</td>
                  <td className="px-5 py-3.5"><PriorityPill p={c.priority} /></td>
                  <td className="px-5 py-3.5"><StatusPill status={c.status} /></td>
                  <td className="px-5 py-3.5 text-right">
                    <button onClick={() => { setEditing(c); setOpen(true); }} className="rounded p-1.5 hover:bg-accent" aria-label="Edit"><Pencil className="h-3.5 w-3.5" /></button>
                    <button onClick={() => remove(c.id)} className="rounded p-1.5 text-destructive hover:bg-destructive/10" aria-label="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && <tr><td colSpan={6} className="px-5 py-12 text-center text-muted-foreground">No cases found.</td></tr>}
          </tbody>
        </table>
      </div>

      <CaseModal key={editing?.id || "new"} open={open} onClose={() => { setOpen(false); setEditing(null); }} initial={editing} onSave={save} clients={clients} />
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    "Open": "bg-info/15 text-info", "In Progress": "bg-gold/15 text-gold",
    "On Hold": "bg-warning/15 text-warning", "Closed": "bg-muted text-muted-foreground",
  };
  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${map[status]}`}>{status}</span>;
}
function PriorityPill({ p }: { p: string }) {
  const map: Record<string, string> = {
    "Low": "bg-muted text-muted-foreground", "Medium": "bg-info/15 text-info",
    "High": "bg-warning/15 text-warning", "Critical": "bg-destructive/15 text-destructive",
  };
  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${map[p]}`}>{p}</span>;
}

function CaseModal({ open, onClose, initial, onSave, clients }: { open: boolean; onClose: () => void; initial: Case | null; onSave: (c: Case) => void; clients: { id: string; name: string }[] }) {
  const empty = (): Case => ({ id: uid(), title: "", number: "", clientId: clients[0]?.id || "", opposingParty: "", priority: "Medium", status: "Open", court: "", createdAt: new Date().toISOString().slice(0, 10) });
  const [form, setForm] = useState<Case>(initial || empty());
  if (open && initial && form.id !== initial.id) setForm(initial);
  if (open && !initial && form.title !== "" && !initial) {} // no-op guard
  return (
    <Modal open={open} onClose={onClose} title={initial ? "Edit case" : "New case"}>
      <form onSubmit={(e) => { e.preventDefault(); if (!form.title || !form.number) return; onSave(form); }} className="space-y-4">
        <Field label="Case title"><input className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Case number"><input className={inputCls} value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value })} required /></Field>
          <Field label="Court"><input className={inputCls} value={form.court} onChange={(e) => setForm({ ...form, court: e.target.value })} /></Field>
        </div>
        <Field label="Client">
          <select className={inputCls} value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })}>
            {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Field>
        <Field label="Opposing party"><input className={inputCls} value={form.opposingParty} onChange={(e) => setForm({ ...form, opposingParty: e.target.value })} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Priority">
            <select className={inputCls} value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as Case["priority"] })}>
              {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
            </select>
          </Field>
          <Field label="Status">
            <select className={inputCls} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Case["status"] })}>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="gold">{initial ? "Save changes" : "Create case"}</Button>
        </div>
      </form>
    </Modal>
  );
}
