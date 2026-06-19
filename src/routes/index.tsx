import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Scale, Shield, Calendar, FileText, Users, Briefcase, CheckCircle2,
  Sparkles, ArrowRight, Star, Gavel, BarChart3, Lock,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lex Counsel — The Premium Platform for Modern Law Firms" },
      { name: "description", content: "Manage cases, clients, hearings, documents, and billing — all from one elegant, secure workspace built for legal professionals." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Hero />
      <Logos />
      <Features />
      <Workflow />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-lg gradient-gold shadow-glow">
            <Scale className="h-5 w-5 text-gold-foreground" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight">Lex Counsel</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground">Features</a>
          <a href="#workflow" className="text-sm text-muted-foreground hover:text-foreground">Workflow</a>
          <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground">Pricing</a>
          <Link to="/admin/login" className="text-sm text-muted-foreground hover:text-foreground">Admin</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/auth/login"><Button variant="ghost" size="sm">Sign in</Button></Link>
          <Link to="/auth/signup"><Button variant="gold" size="sm">Get started</Button></Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[600px] w-[1200px] -translate-x-1/2 rounded-full bg-gradient-to-br from-gold/20 via-primary/10 to-transparent blur-3xl" />
      </div>
      <div className="mx-auto max-w-7xl px-6 pt-24 pb-20 text-center">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-medium text-gold">
          <Sparkles className="h-3.5 w-3.5" /> Trusted by 500+ law firms worldwide
        </div>
        <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
          The premium operating <br />
          system for <span className="text-gradient-gold">modern law firms</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Cases, clients, hearings, documents, and billing — unified in one beautifully crafted workspace.
          Built by legal professionals, for legal professionals.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link to="/auth/signup">
            <Button variant="hero" size="lg" className="h-12 px-7 text-base">
              Start free trial <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/auth/login">
            <Button variant="outline" size="lg" className="h-12 px-7 text-base">
              Sign in to your firm
            </Button>
          </Link>
        </div>
        <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { v: "500+", l: "Law firms" },
            { v: "50k+", l: "Cases managed" },
            { v: "99.9%", l: "Uptime SLA" },
            { v: "4.9/5", l: "User rating" },
          ].map((s) => (
            <div key={s.l} className="glass rounded-2xl p-6">
              <div className="font-display text-3xl font-bold text-gradient-gold">{s.v}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Logos() {
  return (
    <div className="border-y border-border/50 bg-muted/30 py-8">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 opacity-60">
          {["BARRINGTON & CO.", "STERLING LAW", "WHITMORE LLP", "HARRINGTON LEGAL", "ASHWORTH CHAMBERS"].map((n) => (
            <span key={n} className="font-display text-sm font-semibold tracking-[0.2em] text-muted-foreground">{n}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Features() {
  const items = [
    { icon: Briefcase, t: "Case Management", d: "Track every case from intake to closure with priority lanes, court details, and lifecycle states." },
    { icon: Users, t: "Client CRM", d: "Centralize client records, contacts, and communications with powerful search and filters." },
    { icon: Calendar, t: "Hearing Calendar", d: "Beautiful month & week views with smart reminders so you never miss a court date." },
    { icon: FileText, t: "Document Vault", d: "Upload, categorize, and preview PDFs, DOCX, XLSX and images — instantly searchable." },
    { icon: CheckCircle2, t: "Task Kanban", d: "Drag-friendly task lanes with deadlines, assignees, and priority tags for your whole team." },
    { icon: BarChart3, t: "Billing & Invoices", d: "Generate elegant invoices, track payment status, and download print-ready bills." },
  ];
  return (
    <section id="features" className="mx-auto max-w-7xl px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-4xl font-bold md:text-5xl">Everything your firm needs.<br />Nothing it doesn't.</h2>
        <p className="mt-4 text-muted-foreground">Seven powerful modules, designed to work as one.</p>
      </div>
      <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {items.map((i) => (
          <div key={i.t} className="group glass rounded-2xl p-7 transition-all hover:shadow-elegant hover:-translate-y-1">
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl gradient-gold shadow-glow">
              <i.icon className="h-6 w-6 text-gold-foreground" />
            </div>
            <h3 className="text-lg font-semibold">{i.t}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{i.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Workflow() {
  return (
    <section id="workflow" className="border-y border-border/50 bg-muted/30 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-4xl font-bold md:text-5xl">A workflow your firm will <span className="text-gradient-gold">actually love</span></h2>
            <p className="mt-4 text-muted-foreground">
              Stop juggling spreadsheets, email threads, and outdated case software. Lex Counsel unifies your practice
              into a single, secure source of truth.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                { i: Lock, t: "Bank-grade security", d: "End-to-end encryption with role-based access control." },
                { i: Shield, t: "Client-attorney privilege", d: "Privileged communications stay strictly confidential." },
                { i: Gavel, t: "Court-ready workflows", d: "Built around the realities of legal practice." },
              ].map((f) => (
                <li key={f.t} className="flex gap-4">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-gold/10 text-gold">
                    <f.i className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold">{f.t}</div>
                    <div className="text-sm text-muted-foreground">{f.d}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="glass rounded-3xl p-2 shadow-elegant">
            <div className="rounded-2xl gradient-navy p-8">
              <div className="mb-6 flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-destructive/80" />
                <div className="h-3 w-3 rounded-full bg-warning/80" />
                <div className="h-3 w-3 rounded-full bg-success/80" />
              </div>
              <div className="space-y-3">
                {[
                  ["Acme v. Globex", "In Progress", "High"],
                  ["Whitfield Estate", "Open", "Medium"],
                  ["Northwind Merger", "In Progress", "Critical"],
                ].map(([t, s, p]) => (
                  <div key={t} className="flex items-center justify-between rounded-xl bg-white/5 p-4 text-white">
                    <div>
                      <div className="text-sm font-medium">{t}</div>
                      <div className="text-xs text-white/60">{s}</div>
                    </div>
                    <span className="rounded-full bg-gold/20 px-2.5 py-1 text-xs font-medium text-gold">{p}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const plans = [
    { name: "Solo", price: "$29", desc: "For independent practitioners", features: ["Up to 50 cases", "Basic reporting", "Email support"] },
    { name: "Firm", price: "$99", desc: "For growing practices", features: ["Unlimited cases", "5 team members", "Advanced analytics", "Priority support"], featured: true },
    { name: "Enterprise", price: "Custom", desc: "For established firms", features: ["Unlimited everything", "SSO & SAML", "Dedicated CSM", "Custom integrations"] },
  ];
  return (
    <section id="pricing" className="mx-auto max-w-7xl px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-4xl font-bold md:text-5xl">Pricing that scales with you</h2>
        <p className="mt-4 text-muted-foreground">Start free for 14 days. No credit card required.</p>
      </div>
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {plans.map((p) => (
          <div key={p.name} className={`relative rounded-3xl p-8 ${p.featured ? "gradient-navy text-white shadow-glow" : "glass"}`}>
            {p.featured && <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full gradient-gold px-3 py-1 text-xs font-semibold text-gold-foreground">Most popular</div>}
            <div className="font-display text-xl font-semibold">{p.name}</div>
            <div className={`mt-1 text-sm ${p.featured ? "text-white/70" : "text-muted-foreground"}`}>{p.desc}</div>
            <div className="mt-6 flex items-baseline gap-1">
              <span className="font-display text-5xl font-bold">{p.price}</span>
              {p.price !== "Custom" && <span className={p.featured ? "text-white/60" : "text-muted-foreground"}>/mo</span>}
            </div>
            <ul className="mt-6 space-y-3 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <CheckCircle2 className={`h-4 w-4 ${p.featured ? "text-gold" : "text-success"}`} /> {f}
                </li>
              ))}
            </ul>
            <Link to="/auth/signup" className="mt-8 block">
              <Button variant={p.featured ? "gold" : "outline"} className="w-full">Get started</Button>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="mx-auto max-w-5xl px-6 pb-24">
      <div className="relative overflow-hidden rounded-3xl gradient-navy p-12 text-center text-white shadow-elegant">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-gold/20 to-transparent" />
        <div className="relative">
          <Star className="mx-auto mb-4 h-8 w-8 text-gold" />
          <h2 className="font-display text-4xl font-bold md:text-5xl">Ready to elevate your practice?</h2>
          <p className="mx-auto mt-4 max-w-xl text-white/70">Join hundreds of firms running a calmer, more profitable practice with Lex Counsel.</p>
          <Link to="/auth/signup" className="mt-8 inline-block">
            <Button variant="hero" size="lg" className="h-12 px-8">Start your free trial</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/50 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 md:flex-row">
        <div className="flex items-center gap-2">
          <Scale className="h-4 w-4 text-gold" />
          <span className="font-display text-sm font-semibold">Lex Counsel</span>
          <span className="text-xs text-muted-foreground">© {new Date().getFullYear()}</span>
        </div>
        <div className="flex gap-6 text-xs text-muted-foreground">
          <a href="#">Privacy</a><a href="#">Terms</a><a href="#">Security</a><a href="#">Contact</a>
        </div>
      </div>
    </footer>
  );
}
