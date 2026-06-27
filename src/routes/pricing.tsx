import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RoyalLogo } from "@/components/royal-logo";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — law.aflix.co.in | AI Legal Practice Suite" },
      { name: "description", content: "Transparent annual pricing for Indian law firms. Starter ₹14,999 to Enterprise ₹1,49,999 per year. 18% GST inclusive options shown." },
      { property: "og:title", content: "law.aflix.co.in Pricing" },
      { property: "og:description", content: "AI-powered LPMS for Indian law firms from ₹14,999/year." },
    ],
  }),
  component: PricingPage,
});

const PLANS = [
  { name: "Starter", base: 14999, gst: 17699, firm: "2–5 Lawyers", desc: "Solo & small chambers", features: ["Up to 5 users", "CNR & cause-list tracker", "Digital vakalatnama vault", "GST invoicing", "WhatsApp status alerts", "Email support"] },
  { name: "Professional", base: 29999, gst: 35399, firm: "5–10 Lawyers", desc: "Growing practices", features: ["Up to 10 users", "AI OCR order parser", "E-signature workflow", "Billable hour analytics", "Court fee ledger", "Priority support"], featured: true },
  { name: "Business", base: 59999, gst: 70799, firm: "10–25 Lawyers", desc: "Mid-size firms", features: ["Up to 25 users", "Trust / escrow ledger", "Litigation risk AI", "Multi-party defence workspace", "Exhibit presenter", "Dedicated onboarding"] },
  { name: "Enterprise", base: 149999, gst: 176999, firm: "25–100+ Lawyers", desc: "Chambers & enterprise", features: ["Unlimited users", "All 51 modules", "SSO & SAML", "Asset discovery AI", "Travel & PNR tracker", "24×7 named CSM"] },
];

const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

function PricingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2.5">
            <RoyalLogo size={32} />
            <div className="leading-tight">
              <div className="font-display text-base font-bold">law.aflix.co.in</div>
              <div className="text-[9px] uppercase tracking-[0.25em] text-gold">AI Legal Practice Suite</div>
            </div>
          </Link>
          <Link to="/auth/signup"><Button variant="gold" size="sm">Start free trial</Button></Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 pt-16 pb-10 text-center">
        <h1 className="font-display text-5xl font-bold md:text-6xl">Plans that fit every Indian firm</h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Annual billing · 18% GST shown inclusive · cancel anytime. Switch tiers as your team grows.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((p) => (
            <div key={p.name} className={`relative rounded-3xl p-7 ${p.featured ? "gradient-navy text-white shadow-glow" : "glass"}`}>
              {p.featured && <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full gradient-gold px-3 py-1 text-xs font-semibold text-gold-foreground">Most popular</div>}
              <div className="font-display text-xl font-semibold">{p.name}</div>
              <div className={`mt-1 text-xs ${p.featured ? "text-white/70" : "text-muted-foreground"}`}>{p.firm} · {p.desc}</div>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-display text-3xl font-bold">{inr(p.base)}</span>
                <span className={`text-xs ${p.featured ? "text-white/60" : "text-muted-foreground"}`}>/yr + GST</span>
              </div>
              <div className="mt-1 text-xs text-gold">{inr(p.gst)} incl. 18% GST</div>
              <ul className="mt-5 space-y-2.5 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${p.featured ? "text-gold" : "text-success"}`} /> <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link to="/auth/signup" className="mt-7 block">
                <Button variant={p.featured ? "gold" : "outline"} className="w-full">Start free trial</Button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="glass rounded-3xl p-8">
          <h2 className="font-display text-2xl font-bold">Pricing benchmark (Indian LPMS market)</h2>
          <p className="mt-1 text-sm text-muted-foreground">For your reference — public list prices of comparable platforms.</p>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="py-2 pr-4">Software</th><th className="py-2">Public Pricing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                <tr><td className="py-2 pr-4 font-medium">MyAdvoMate</td><td className="py-2">Starter ₹15,000/yr · Pro ₹35,000/yr · Enterprise custom</td></tr>
                <tr><td className="py-2 pr-4 font-medium">GetYourLawyers</td><td className="py-2">Basic ₹999/mo · Professional ₹1,899/mo</td></tr>
                <tr><td className="py-2 pr-4 font-medium">Legalspace</td><td className="py-2">~₹1,899/mo</td></tr>
                <tr><td className="py-2 pr-4 font-medium">Jamku Portal</td><td className="py-2">₹7,000/yr</td></tr>
                <tr><td className="py-2 pr-4 font-medium">Provakil / eLawOffice</td><td className="py-2">Custom quotation (medium–large firms)</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-10 rounded-3xl gradient-navy p-10 text-center text-white shadow-elegant">
          <h2 className="font-display text-3xl font-bold">100+ lawyers? Need on-prem or a custom SLA?</h2>
          <p className="mt-2 text-white/70">Talk to our enterprise team for volume pricing, dedicated infra, and integrations.</p>
          <a href="mailto:sales@aflix.co.in" className="mt-6 inline-block">
            <Button variant="gold" size="lg">Contact sales</Button>
          </a>
        </div>
      </section>

      <footer className="border-t border-border/50 py-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-2"><Scale className="h-4 w-4 text-gold" /> law.aflix.co.in © {new Date().getFullYear()}</div>
          <Link to="/" className="hover:text-foreground">← Back to home</Link>
        </div>
      </footer>
    </div>
  );
}
