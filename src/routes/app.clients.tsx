import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Search, Pencil, Trash2, Mail, Phone, Building2 } from "lucide-react";
import { store, useStore, uid, type Client } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { PageHeader, Modal, Field, inputCls } from "@/components/page-header";
import { toast } from "sonner";

export const Route = createFileRoute("/app/clients")({
  head: () => ({ meta: [{ title: "Clients — Lex Counsel" }] }),
  component: Clients,
});

function Clients() {
  const clients = useStore((s) => s.clients);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Client | null>(null);
  const [open, setOpen] = useState(false);

  const filtered = clients.filter((c) =>
    [c.name, c.email, c.phone, c.company || ""].join(" ").toLowerCase().includes(q.toLowerCase()),
  );

  const save = (c: Client) => {
    store.set((s) => ({
      clients: editing ? s.clients.map((x) => (x.id === c.id ? c : x)) : [c, ...s.clients],
    }));
    toast.success(editing ? "Client updated" : "Client added");
    setOpen(false); setEditing(null);
  };

  const remove = (id: string) => {
    store.set((s) => ({ clients: s.clients.filter((c) => c.id !== id) }));
    toast.success("Client removed");
  };

  return (
    <div>
      <PageHeader title="Clients" subtitle="Manage your client roster"
        action={
          <Button variant="gold" onClick={() => { setEditing(null); setOpen(true); }}>
            <Plus className="h-4 w-4" /> Add client
          </Button>
        } />

      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search clients..."
            className="h-10 w-full rounded-lg border border-input bg-muted/40 pl-10 pr-3 text-sm focus:bg-background focus:outline-none focus:ring-2 focus:ring-gold" />
        </div>
        <div className="text-sm text-muted-foreground">{filtered.length} of {clients.length}</div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((c) => (
          <div key={c.id} className="group rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-elegant">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl gradient-gold text-lg font-bold text-gold-foreground">
                  {c.name[0]}
                </div>
                <div className="min-w-0">
                  <div className="truncate font-semibold">{c.name}</div>
                  {c.company && <div className="truncate text-xs text-muted-foreground flex items-center gap-1"><Building2 className="h-3 w-3" />{c.company}</div>}
                </div>
              </div>
              <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button onClick={() => { setEditing(c); setOpen(true); }} className="rounded p-1.5 hover:bg-accent" aria-label="Edit"><Pencil className="h-3.5 w-3.5" /></button>
                <button onClick={() => remove(c.id)} className="rounded p-1.5 text-destructive hover:bg-destructive/10" aria-label="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
            <div className="mt-4 space-y-1.5 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground"><Mail className="h-3.5 w-3.5" />{c.email}</div>
              <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-3.5 w-3.5" />{c.phone}</div>
            </div>
            <div className="mt-3 text-xs text-muted-foreground">Since {c.createdAt}</div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="md:col-span-2 xl:col-span-3 rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
            No clients match your search.
          </div>
        )}
      </div>

      <ClientModal key={editing?.id || "new"} open={open} onClose={() => { setOpen(false); setEditing(null); }} initial={editing} onSave={save} />
    </div>
  );
}

function ClientModal({ open, onClose, initial, onSave }: { open: boolean; onClose: () => void; initial: Client | null; onSave: (c: Client) => void }) {
  const [form, setForm] = useState<Client>(initial || { id: uid(), name: "", email: "", phone: "", company: "", createdAt: new Date().toISOString().slice(0, 10) });
  // reset on open
  if (open && initial && form.id !== initial.id) setForm(initial);
  if (open && !initial && form.id === (initial as any)?.id) setForm({ id: uid(), name: "", email: "", phone: "", company: "", createdAt: new Date().toISOString().slice(0, 10) });

  return (
    <Modal open={open} onClose={onClose} title={initial ? "Edit client" : "Add new client"}>
      <form onSubmit={(e) => { e.preventDefault(); if (!form.name || !form.email) return; onSave(form); }} className="space-y-4">
        <Field label="Full name"><input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></Field>
        <Field label="Email"><input type="email" className={inputCls} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></Field>
        <Field label="Phone"><input className={inputCls} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
        <Field label="Company (optional)"><input className={inputCls} value={form.company || ""} onChange={(e) => setForm({ ...form, company: e.target.value })} /></Field>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="gold">{initial ? "Save changes" : "Add client"}</Button>
        </div>
      </form>
    </Modal>
  );
}
