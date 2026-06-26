import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { Briefcase, Calendar, CheckSquare, TrendingUp, ArrowUpRight, Clock, Wallet, Receipt, PiggyBank, Banknote } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, BarChart, Bar } from "recharts";

export const Route = createFileRoute("/app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Vajra Legal Chambers" }] }),
  component: Dashboard,
});

const revenueData = [
  { m: "Jan", r: 38000 }, { m: "Feb", r: 42000 }, { m: "Mar", r: 51000 },
  { m: "Apr", r: 48000 }, { m: "May", r: 63000 }, { m: "Jun", r: 71000 },
];
const casesData = [
  { m: "Jan", o: 12, c: 8 }, { m: "Feb", o: 15, c: 10 },
  { m: "Mar", o: 18, c: 11 }, { m: "Apr", o: 14, c: 13 },
  { m: "May", o: 22, c: 15 }, { m: "Jun", o: 25, c: 18 },
];

function Dashboard() {
  const cases = useStore((s) => s.cases);
  const hearings = useStore((s) => s.hearings);
  const tasks = useStore((s) => s.tasks);
  const invoices = useStore((s) => s.invoices);

  const activeCases = cases.filter((c) => c.status !== "Closed").length;
  const upcomingHearings = hearings.filter((h) => new Date(h.date) >= new Date()).length;
  const pendingTasks = tasks.filter((t) => t.status !== "Completed").length;
  const totalRevenue = invoices.filter((i) => i.status === "Paid").reduce((a, i) => a + i.amount, 0);

  const stats = [
    { label: "Active Cases", value: activeCases, icon: Briefcase, trend: "+12%", color: "text-info" },
    { label: "Upcoming Hearings", value: upcomingHearings, icon: Calendar, trend: "Next: 2d", color: "text-warning" },
    { label: "Pending Tasks", value: pendingTasks, icon: CheckSquare, trend: "+3 today", color: "text-gold" },
    { label: "Revenue (YTD)", value: `$${(totalRevenue / 1000).toFixed(1)}k`, icon: TrendingUp, trend: "+24%", color: "text-success" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Good day, counselor</h1>
        <p className="text-muted-foreground">Here's what's happening with your practice today.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-elegant">
            <div className="flex items-start justify-between">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-muted">
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <span className={`text-xs font-semibold ${s.color}`}>{s.trend}</span>
            </div>
            <div className="mt-4 font-display text-3xl font-bold">{s.value}</div>
            <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <FinancialLedger />


      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-bold">Revenue Summary</h2>
              <p className="text-xs text-muted-foreground">Monthly billing performance</p>
            </div>
            <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">+24% YoY</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.78 0.14 78)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="oklch(0.78 0.14 78)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
                <XAxis dataKey="m" stroke="currentColor" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="currentColor" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }} />
                <Area type="monotone" dataKey="r" stroke="oklch(0.78 0.14 78)" strokeWidth={2.5} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-4 font-display text-xl font-bold">Cases This Year</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={casesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
                <XAxis dataKey="m" stroke="currentColor" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="currentColor" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }} />
                <Bar dataKey="o" fill="oklch(0.78 0.14 78)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="c" fill="oklch(0.5 0.05 255)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex items-center justify-around text-xs">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-gold" /> Opened</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-muted-foreground" /> Closed</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-bold">Upcoming Hearings</h2>
            <Link to="/app/calendar" className="text-xs text-gold hover:underline flex items-center gap-1">View all <ArrowUpRight className="h-3 w-3" /></Link>
          </div>
          <div className="space-y-3">
            {hearings.slice(0, 4).map((h) => (
              <div key={h.id} className="flex items-center gap-4 rounded-xl bg-muted/40 p-3.5">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg gradient-gold text-gold-foreground">
                  <Calendar className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{h.title}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{h.date} · {h.time} · {h.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-bold">Recent Cases</h2>
            <Link to="/app/cases" className="text-xs text-gold hover:underline flex items-center gap-1">View all <ArrowUpRight className="h-3 w-3" /></Link>
          </div>
          <div className="space-y-3">
            {cases.slice(0, 4).map((c) => (
              <div key={c.id} className="flex items-center gap-4 rounded-xl bg-muted/40 p-3.5">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{c.title}</div>
                  <div className="text-xs text-muted-foreground">{c.number} · {c.court}</div>
                </div>
                <StatusPill status={c.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    "Open": "bg-info/15 text-info",
    "In Progress": "bg-gold/15 text-gold",
    "On Hold": "bg-warning/15 text-warning",
    "Closed": "bg-muted text-muted-foreground",
  };
  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${map[status] || "bg-muted"}`}>{status}</span>;
}

function FinancialLedger() {
  const invoices = useStore((s) => s.invoices);
  const received = invoices.filter((i) => i.status === "Paid").reduce((a, i) => a + (i.amount || 0), 0);
  const pending = invoices.filter((i) => i.status !== "Paid").reduce((a, i) => a + (i.amount || 0), 0);
  const retainer = 850000;
  const escrow = 4218500;
  const items = [
    { label: "Fees Received", value: received, icon: Banknote, tone: "text-success", hint: "All paid invoices" },
    { label: "Fees Pending", value: pending, icon: Receipt, tone: "text-warning", hint: "Outstanding & overdue" },
    { label: "Retainer Balance", value: retainer, icon: Wallet, tone: "text-gold", hint: "Across active matters" },
    { label: "Escrow / Trust", value: escrow, icon: PiggyBank, tone: "text-info", hint: "Bar-Council compliant" },
  ];
  const splits = [
    { matter: "Acme v. Globex IP", lead: "60%", junior: "25%", firm: "15%" },
    { matter: "Northwind Merger", lead: "50%", junior: "30%", firm: "20%" },
    { matter: "Whitfield Estate", lead: "70%", junior: "15%", firm: "15%" },
  ];
  const fmt = (n: number) => "₹" + n.toLocaleString("en-IN");
  return (
    <div className="rounded-2xl border border-gold/30 bg-gradient-to-br from-card to-card/60 p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gold">Financial Core</div>
          <h2 className="font-display text-xl font-bold">Client Billing, Escrow & Fee Ledger</h2>
        </div>
        <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-gold">Live</span>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {items.map((it) => (
          <div key={it.label} className="rounded-xl border border-border bg-background/40 p-4">
            <div className="flex items-center gap-2"><it.icon className={`h-4 w-4 ${it.tone}`} /><span className="text-xs text-muted-foreground">{it.label}</span></div>
            <div className="mt-2 font-display text-2xl font-bold">{fmt(it.value)}</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{it.hint}</div>
          </div>
        ))}
      </div>
      <div className="mt-5">
        <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Split-billing log</div>
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-[10px] uppercase tracking-wider text-muted-foreground">
              <tr><th className="px-4 py-2 text-left">Matter</th><th className="px-4 py-2 text-left">Lead</th><th className="px-4 py-2 text-left">Junior</th><th className="px-4 py-2 text-left">Firm</th></tr>
            </thead>
            <tbody>
              {splits.map((s) => (
                <tr key={s.matter} className="border-t border-border">
                  <td className="px-4 py-2.5 font-medium">{s.matter}</td>
                  <td className="px-4 py-2.5 text-gold">{s.lead}</td>
                  <td className="px-4 py-2.5">{s.junior}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{s.firm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
