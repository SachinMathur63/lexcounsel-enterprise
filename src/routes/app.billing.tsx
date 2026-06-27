import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Download, Eye, Trash2, IndianRupee, CheckCircle, Clock, AlertTriangle, Wallet, Receipt as ReceiptIcon } from "lucide-react";
import { store, useStore, uid, type Invoice } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { PageHeader, Modal, Field, inputCls } from "@/components/page-header";
import { toast } from "sonner";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/app/billing")({
  head: () => ({ meta: [{ title: "Fee Ledger — Vajra Legal Chambers" }] }),
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

  // Demo derived ledger figures
  const retainerEscrow = 4218500;
  const unbilledExpenses = 184750;
  const monthly = [
    { m: "Jan", recv: 820000, pend: 240000 },
    { m: "Feb", recv: 910000, pend: 280000 },
    { m: "Mar", recv: 1180000, pend: 320000 },
    { m: "Apr", recv: 1340000, pend: 410000 },
    { m: "May", recv: 1520000, pend: 380000 },
    { m: "Jun", recv: 1690000, pend: 450000 },
  ];
  const split = [
    { name: "Received", value: paid, color: "oklch(0.7 0.16 150)" },
    { name: "Pending", value: pending, color: "oklch(0.78 0.14 78)" },
    { name: "Overdue", value: overdue, color: "oklch(0.62 0.22 27)" },
    { name: "Retainer Escrow", value: retainerEscrow, color: "oklch(0.6 0.15 240)" },
  ];
  const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  return (
    <div>
      <PageHeader title="Client Fee Ledger" subtitle="Real-time tracking of received, pending, retainer escrow & unbilled expenses"
        action={<Button variant="gold" onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> New invoice</Button>} />

      <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <Stat label="Fees Received" value={fmt(paid)} icon={CheckCircle} color="text-success" />
        <Stat label="Fees Pending" value={fmt(pending + overdue)} icon={Clock} color="text-gold" />
        <Stat label="Retainer Escrow" value={fmt(retainerEscrow)} icon={Wallet} color="text-info" />
        <Stat label="Unbilled Expenses" value={fmt(unbilledExpenses)} icon={ReceiptIcon} color="text-warning" />
        <Stat label="Total Billed" value={fmt(total)} icon={IndianRupee} color="text-foreground" />
      </div>

      <div className="mb-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-bold">Fee Inflow Curve</h2>
              <p className="text-xs text-muted-foreground">Last 6 months · Received vs Pending</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={monthly}>
                <defs>
                  <linearGradient id="gRecv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.78 0.14 78)" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="oklch(0.78 0.14 78)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gPend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.6 0.15 240)" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="oklch(0.6 0.15 240)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
                <XAxis dataKey="m" stroke="currentColor" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="currentColor" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }} formatter={(v: number) => fmt(v)} />
                <Area type="monotone" dataKey="recv" name="Received" stroke="oklch(0.78 0.14 78)" strokeWidth={2.5} fill="url(#gRecv)" />
                <Area type="monotone" dataKey="pend" name="Pending" stroke="oklch(0.6 0.15 240)" strokeWidth={2.5} fill="url(#gPend)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-4 font-display text-xl font-bold">Ledger Composition</h2>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={split} cx="50%" cy="50%" innerRadius={48} outerRadius={86} paddingAngle={3} dataKey="value">
                  {split.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }} formatter={(v: number) => fmt(v)} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-4 font-display text-xl font-bold">Monthly Realisation vs Outstanding</h2>
        <div className="h-56">
          <ResponsiveContainer>
            <BarChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
              <XAxis dataKey="m" stroke="currentColor" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="currentColor" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
              <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }} formatter={(v: number) => fmt(v)} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="recv" name="Received" fill="oklch(0.78 0.14 78)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="pend" name="Pending" fill="oklch(0.6 0.15 240)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
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
                <div className="font-display text-2xl font-bold text-gradient-gold">Vajra Legal Chambers</div>
                <div className="text-xs text-muted-foreground">Supreme Court of India · New Delhi</div>
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
