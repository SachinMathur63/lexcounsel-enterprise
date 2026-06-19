import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Download, Eye, Trash2, DollarSign, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { store, useStore, uid, type Invoice } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { PageHeader, Modal, Field, inputCls } from "@/components/page-header";
import { toast } from "sonner";

export const Route = createFileRoute("/app/billing")({
  head: () => ({ meta: [{ title: "Billing — Lex Counsel" }] }),
  component: Billing,
});

function Billing() {
  const invoices = useStore((s) => s.invoices);
  const clients = useStore((s) => s.clients);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<Invoice | null>(null);

  const total = invoices.reduce((a, i) => a + i.amount, 0);
  const paid = invoices.filter((i) => i.status === "Paid").reduce((a, i) => a + i.amount, 0);
  const pending = invoices.filter((i) => i.status === "Pending").reduce((a, i) => a + i.amount, 0);
  const overdue = invoices.filter((i) => i.status === "Overdue").reduce((a, i) => a + i.amount, 0);

  const save = (inv: Invoice) => {
    store.set((s) => ({ invoices: [inv, ...s.invoices] }));
    toast.success("Invoice created");
    setOpen(false);
  };
  const remove = (id: string) => {
    store.set((s) => ({ invoices: s.invoices.filter((i) => i.id !== id) }));
    toast.success("Invoice deleted");
  };
  const setStatus = (id: string, status: Invoice["status"]) =>
    store.set((s) => ({ invoices: s.invoices.map((i) => (i.id === id ? { ...i, status } : i)) }));

  return (
    <div>
      <PageHeader title="Billing & Invoices" subtitle="Generate, track, and download invoices"
        action={<Button variant="gold" onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> New invoice</Button>} />

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Stat label="Total billed" value={`$${total.toLocaleString()}`} icon={DollarSign} color="text-info" />
        <Stat label="Paid" value={`$${paid.toLocaleString()}`} icon={CheckCircle} color="text-success" />
        <Stat label="Pending" value={`$${pending.toLocaleString()}`} icon={Clock} color="text-gold" />
        <Stat label="Overdue" value={`$${overdue.toLocaleString()}`} icon={AlertTriangle} color="text-destructive" />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-5 py-3 text-left">Invoice</th>
              <th className="px-5 py-3 text-left">Client</th>
              <th className="px-5 py-3 text-left">Issued</th>
              <th className="px-5 py-3 text-left">Due</th>
              <th className="px-5 py-3 text-right">Amount</th>
              <th className="px-5 py-3 text-left">Status</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((i) => {
              const client = clients.find((c) => c.id === i.clientId);
              return (
                <tr key={i.id} className="border-t border-border hover:bg-muted/30">
                  <td className="px-5 py-3.5 font-mono text-xs font-semibold">{i.number}</td>
                  <td className="px-5 py-3.5">{client?.name || "—"}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{i.issued}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{i.due}</td>
                  <td className="px-5 py-3.5 text-right font-semibold">${i.amount.toLocaleString()}</td>
                  <td className="px-5 py-3.5">
                    <select value={i.status} onChange={(e) => setStatus(i.id, e.target.value as Invoice["status"])}
                      className={`rounded-full border-0 px-2.5 py-1 text-xs font-medium ${statusCls(i.status)} focus:outline-none focus:ring-2 focus:ring-gold`}>
                      <option>Paid</option><option>Pending</option><option>Overdue</option>
                    </select>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button onClick={() => setView(i)} className="rounded p-1.5 hover:bg-accent" aria-label="View"><Eye className="h-3.5 w-3.5" /></button>
                    <button onClick={() => toast.success("PDF downloaded")} className="rounded p-1.5 hover:bg-accent" aria-label="Download"><Download className="h-3.5 w-3.5" /></button>
                    <button onClick={() => remove(i.id)} className="rounded p-1.5 text-destructive hover:bg-destructive/10" aria-label="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal open={!!view} onClose={() => setView(null)} title={view ? `Invoice ${view.number}` : ""}>
        {view && (
          <div className="rounded-xl border border-border p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-display text-2xl font-bold text-gradient-gold">Lex Counsel</div>
                <div className="text-xs text-muted-foreground">123 Legal Plaza · New York, NY</div>
              </div>
              <div className="text-right">
                <div className="font-mono text-sm font-semibold">{view.number}</div>
                <div className="text-xs text-muted-foreground">Issued {view.issued}</div>
                <div className="text-xs text-muted-foreground">Due {view.due}</div>
              </div>
            </div>
            <div className="my-5 border-t border-border" />
            <div className="text-xs uppercase text-muted-foreground">Bill to</div>
            <div className="font-medium">{clients.find((c) => c.id === view.clientId)?.name}</div>
            <table className="mt-5 w-full text-sm">
              <thead className="border-b border-border text-xs text-muted-foreground">
                <tr><th className="py-2 text-left">Description</th><th className="text-right">Qty</th><th className="text-right">Rate</th><th className="text-right">Amount</th></tr>
              </thead>
              <tbody>
                {view.items.map((it, i) => (
                  <tr key={i} className="border-b border-border">
                    <td className="py-3">{it.desc}</td><td className="text-right">{it.qty}</td>
                    <td className="text-right">${it.rate}</td><td className="text-right">${(it.qty * it.rate).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 flex justify-end">
              <div className="rounded-lg gradient-gold px-5 py-3 text-gold-foreground">
                <div className="text-xs uppercase">Total due</div>
                <div className="font-display text-2xl font-bold">${view.amount.toLocaleString()}</div>
              </div>
            </div>
            <Button variant="gold" className="mt-5 w-full" onClick={() => toast.success("PDF downloaded")}>
              <Download className="h-4 w-4" /> Download PDF
            </Button>
          </div>
        )}
      </Modal>

      <NewInvoice open={open} onClose={() => setOpen(false)} onSave={save} clients={clients} />
    </div>
  );
}

function statusCls(s: string) {
  return { Paid: "bg-success/15 text-success", Pending: "bg-gold/15 text-gold", Overdue: "bg-destructive/15 text-destructive" }[s as "Paid"] || "bg-muted";
}

function Stat({ label, value, icon: Icon, color }: any) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">{label}</div>
        <Icon className={`h-4 w-4 ${color}`} />
      </div>
      <div className="mt-2 font-display text-2xl font-bold">{value}</div>
    </div>
  );
}

function NewInvoice({ open, onClose, onSave, clients }: { open: boolean; onClose: () => void; onSave: (i: Invoice) => void; clients: { id: string; name: string }[] }) {
  const [form, setForm] = useState({
    clientId: clients[0]?.id || "", desc: "Legal services", qty: 10, rate: 500,
    issued: new Date().toISOString().slice(0, 10),
    due: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
  });
  const amount = form.qty * form.rate;
  return (
    <Modal open={open} onClose={onClose} title="Create invoice">
      <form onSubmit={(e) => {
        e.preventDefault();
        onSave({
          id: uid(), number: `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100)}`,
          clientId: form.clientId, amount, status: "Pending", issued: form.issued, due: form.due,
          items: [{ desc: form.desc, qty: form.qty, rate: form.rate }],
        });
      }} className="space-y-4">
        <Field label="Client">
          <select className={inputCls} value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })}>
            {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Field>
        <Field label="Description"><input className={inputCls} value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Quantity (hrs)"><input type="number" min={1} className={inputCls} value={form.qty} onChange={(e) => setForm({ ...form, qty: +e.target.value })} /></Field>
          <Field label="Rate ($)"><input type="number" min={0} className={inputCls} value={form.rate} onChange={(e) => setForm({ ...form, rate: +e.target.value })} /></Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Issued"><input type="date" className={inputCls} value={form.issued} onChange={(e) => setForm({ ...form, issued: e.target.value })} /></Field>
          <Field label="Due"><input type="date" className={inputCls} value={form.due} onChange={(e) => setForm({ ...form, due: e.target.value })} /></Field>
        </div>
        <div className="rounded-lg bg-muted p-3 text-right">
          <span className="text-xs text-muted-foreground">Total: </span>
          <span className="font-display text-xl font-bold text-gold">${amount.toLocaleString()}</span>
        </div>
        <div className="flex justify-end gap-2"><Button type="button" variant="ghost" onClick={onClose}>Cancel</Button><Button type="submit" variant="gold">Create invoice</Button></div>
      </form>
    </Modal>
  );
}
