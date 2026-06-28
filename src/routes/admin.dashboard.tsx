import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { store, useStore } from "@/lib/store";
import { Users, Briefcase, Receipt, Activity, Shield, LogOut, TrendingUp, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";

export const Route = createFileRoute("/admin/dashboard")({
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    if (!store.get().isAdmin) throw redirect({ to: "/admin/login" });
  },
  head: () => ({ meta: [{ title: "Restricted Supreme Admin — AFLIX LEGAL SOLUTIONS PVT. LTD." }] }),
  component: AdminDash,
});

const usage = [
  { d: "Mon", u: 142 }, { d: "Tue", u: 168 }, { d: "Wed", u: 195 },
  { d: "Thu", u: 178 }, { d: "Fri", u: 220 }, { d: "Sat", u: 110 }, { d: "Sun", u: 89 },
];
const rolePie = [
  { name: "Lawyers", value: 312, color: "oklch(0.78 0.14 78)" },
  { name: "Paralegals", value: 148, color: "oklch(0.6 0.15 240)" },
  { name: "Clients", value: 1042, color: "oklch(0.65 0.16 150)" },
];

function AdminDash() {
  const clients = useStore((s) => s.clients);
  const cases = useStore((s) => s.cases);
  const invoices = useStore((s) => s.invoices);
  const navigate = useNavigate();

  const logout = () => { store.set(() => ({ user: null, isAdmin: false })); navigate({ to: "/admin/login" }); };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/admin/dashboard" className="flex items-center gap-2.5">
            <div className="grid h-10 w-10 place-items-center rounded-lg gradient-gold shadow-glow"><Shield className="h-5 w-5 text-gold-foreground" /></div>
            <div>
              <div className="font-display text-base font-bold tracking-wide">👑 AFLIX LEGAL SOLUTIONS PVT. LTD. ⚖️</div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gold">Restricted Supreme Admin</div>
            </div>
          </Link>
          <Button variant="outline" onClick={logout}><LogOut className="h-4 w-4" /> Sign out</Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-6 py-8">
        <div>
          <h1 className="font-display text-3xl font-bold">System Overview</h1>
          <p className="text-muted-foreground">Global stats, user matrix, and platform health.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <AdminStat label="Total Users" value="1,502" delta="+8.2%" icon={Users} color="text-info" />
          <AdminStat label="Active Firms" value="523" delta="+12 this week" icon={Briefcase} color="text-gold" />
          <AdminStat label="Platform Revenue" value="$284k" delta="+24% MoM" icon={Receipt} color="text-success" />
          <AdminStat label="System Health" value="99.97%" delta="All systems normal" icon={Activity} color="text-success" />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-6 lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-display text-xl font-bold">Daily Active Users</h2>
                <p className="text-xs text-muted-foreground">Last 7 days</p>
              </div>
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={usage}>
                  <defs>
                    <linearGradient id="adm" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.78 0.14 78)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="oklch(0.78 0.14 78)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
                  <XAxis dataKey="d" stroke="currentColor" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="currentColor" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }} />
                  <Area type="monotone" dataKey="u" stroke="oklch(0.78 0.14 78)" strokeWidth={2.5} fill="url(#adm)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-4 font-display text-xl font-bold">User Distribution</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={rolePie} cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={3} dataKey="value">
                    {rolePie.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-4 font-display text-xl font-bold">Platform Snapshot</h2>
            <div className="space-y-2.5">
              <Row k="Total cases (system-wide)" v={cases.length.toString()} />
              <Row k="Total clients onboarded" v={clients.length.toString()} />
              <Row k="Invoices generated" v={invoices.length.toString()} />
              <Row k="Storage used" v="2.4 TB / 10 TB" />
              <Row k="API requests (24h)" v="1.2M" />
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-bold"><AlertTriangle className="h-5 w-5 text-warning" /> System Alerts</h2>
            <div className="space-y-3">
              {[
                { t: "Backup completed", d: "Daily snapshot saved to cold storage · 2h ago", c: "success" },
                { t: "Unusual login pattern detected", d: "User attempted from 3 countries in 1hr · 5h ago", c: "warning" },
                { t: "New firm registered", d: "Hartwell & Associates joined the platform · 1d ago", c: "info" },
              ].map((a, i) => (
                <div key={i} className="rounded-xl border border-border bg-background p-3.5">
                  <div className="flex items-start justify-between">
                    <div className="font-medium">{a.t}</div>
                    <span className={`rounded px-2 py-0.5 text-[10px] uppercase ${a.c === "success" ? "bg-success/15 text-success" : a.c === "warning" ? "bg-warning/15 text-warning" : "bg-info/15 text-info"}`}>{a.c}</span>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{a.d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-4 font-display text-xl font-bold">User Control Matrix</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
                <tr><th className="px-4 py-2 text-left">User</th><th className="px-4 py-2 text-left">Role</th><th className="px-4 py-2 text-left">Firm</th><th className="px-4 py-2 text-left">Status</th><th className="px-4 py-2 text-left">Last Active</th></tr>
              </thead>
              <tbody>
                {[
                  ["Sarah Kingston", "Lawyer", "Sterling Law", "Active", "2 min ago"],
                  ["Mark Thompson", "Paralegal", "Sterling Law", "Active", "12 min ago"],
                  ["Elena Whitfield", "Lawyer", "Whitmore LLP", "Active", "1h ago"],
                  ["James Holloway", "Lawyer", "Barrington & Co.", "Suspended", "2d ago"],
                  ["Priya Sharma", "Lawyer", "Ashworth Chambers", "Active", "Just now"],
                ].map(([n, r, f, s, l]) => (
                  <tr key={n} className="border-t border-border">
                    <td className="px-4 py-3 font-medium">{n}</td>
                    <td className="px-4 py-3">{r}</td>
                    <td className="px-4 py-3 text-muted-foreground">{f}</td>
                    <td className="px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-xs ${s === "Active" ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"}`}>{s}</span></td>
                    <td className="px-4 py-3 text-muted-foreground">{l}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

function AdminStat({ label, value, delta, icon: Icon, color }: any) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-start justify-between">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-muted"><Icon className={`h-5 w-5 ${color}`} /></div>
        <span className={`text-xs font-semibold ${color}`}>{delta}</span>
      </div>
      <div className="mt-4 font-display text-3xl font-bold">{value}</div>
      <div className="mt-1 text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-muted/40 px-4 py-2.5 text-sm">
      <span className="text-muted-foreground">{k}</span><span className="font-semibold">{v}</span>
    </div>
  );
}
