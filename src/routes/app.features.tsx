import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Scale, Gavel, FileSearch, MessageSquare, Receipt, Wallet, Users, PenTool, CalendarSync,
  Languages, Timer, FileSignature, Lock, Network, UserSearch, BarChart3, ShieldAlert, GitBranch,
  Stamp, BookOpen, WifiOff, FileUp, Bot, EyeOff, Swords, Banknote, Globe2, Briefcase, Crown,
  Newspaper, Skull, Building2, Plane, Boxes, Mic, ScrollText, Bell, Video, FileBadge,
  Search, TrendingUp, FileCheck, MapPin, MonitorPlay, FolderLock, Hourglass, HeartHandshake, Landmark, Radar, UserCog,
} from "lucide-react";

export const Route = createFileRoute("/app/features")({
  head: () => ({ meta: [{ title: "Capabilities — law.aflix.co.in" }] }),
  component: FeaturesPage,
});

type Feature = { n: number; title: string; desc: string; icon: any; demo?: () => string };

const FEATURES: Feature[] = [
  { n: 1, title: "16-Digit CNR Case Tracker", desc: "Live e-Courts sync for ongoing case statuses.", icon: FileSearch, demo: () => "CNR DLCT01-001234-2025 → Next listing: 14-Jul, Court 3, Hon'ble Justice Khanna. Stage: Arguments." },
  { n: 2, title: "Live Cause List Scraper", desc: "Daily lists across District, High, Supreme Courts.", icon: ScrollText, demo: () => "Today: 7 matters listed — 3 SC, 2 DHC, 2 Saket. Earliest: 10:30 SC Court 4 item 27." },
  { n: 3, title: "Devanagari + English OCR", desc: "Reads handwritten FIRs, panchnamas, trial sheets.", icon: ScrollText, demo: () => "OCR confidence 94.2% · 12 pages digitised · 3 entities flagged for review." },
  { n: 4, title: "AI Order Copy Parser", desc: "Extracts next hearing, interim reliefs, penalties.", icon: Gavel, demo: () => "Next date: 22-Aug-2026 · Interim: Status quo on suit property · Cost: ₹25,000 imposed on R-2." },
  { n: 5, title: "WhatsApp Status Gateway", desc: "Real-time client alerts on every e-Courts change.", icon: MessageSquare, demo: () => "Broadcast queued to 14 clients · Provider: Gupshup · Delivery ETA 30s." },
  { n: 6, title: "GST/CGST/SGST/RCM Invoicing", desc: "Indian tax engine with reverse-charge support.", icon: Receipt, demo: () => "Invoice ₹1,18,000 → Base ₹1,00,000 + CGST 9% + SGST 9% · RCM applicable: No." },
  { n: 7, title: "Disbursement & Micro-Ledger", desc: "Stamp paper, welfare fund, court fee, courier.", icon: Wallet, demo: () => "Today's disbursements: ₹4,820 across 6 entries (₹2,000 stamp + ₹1,500 court fee + ₹1,320 misc)." },
  { n: 8, title: "Role-Based Client Portal", desc: "Clients view timelines, upload docs, pay fees.", icon: Users, demo: () => "Active client sessions: 23 · 4 pending uploads · 2 payment links opened in last hour." },
  { n: 9, title: "Generative Drafting Engine", desc: "Bail (BNSS), Notices (NI Act), Plaints from prompts.", icon: PenTool, demo: () => "Draft generated · 11 pages · 3 precedents cited · ready for partner review." },
  { n: 10, title: "Multi-Calendar Sync", desc: "Two-way sync: e-Courts, Google, Outlook.", icon: CalendarSync, demo: () => "Sync OK · 47 events reconciled · 0 conflicts." },
  { n: 11, title: "Vernacular Court Translator", desc: "10+ Indian languages, legal-grade fidelity.", icon: Languages, demo: () => "EN → HI · 4,210 words · legal-terminology preserved (s.300 IPC mapped to धारा 300)." },
  { n: 12, title: "Floating Time Tracker", desc: "Bill research & consultations onto active invoices.", icon: Timer, demo: () => "Running: Acme v. Globex · 01:24:32 · billable @ ₹15,000/hr." },
  { n: 13, title: "Voice Dictation (HI/EN)", desc: "Speech-to-text into structured legal drafts.", icon: Mic, demo: () => "Recording 00:42 · 128 words transcribed · auto-formatted as a Plaint." },
  { n: 14, title: "Digital Vakalatnama Generator", desc: "Auto-populated standard templates.", icon: FileSignature, demo: () => "Vakalatnama for Adv. R. Mehra in CS(OS) 142/2026 prepared · ready to e-stamp." },
  { n: 15, title: "Encrypted Vault Storage", desc: "Client_id / case_id segregated AES-256 vault.", icon: Lock, demo: () => "Vault healthy · 2.4 TB encrypted · last key rotation 6h ago." },
  { n: 16, title: "Witness & Evidence Matrix", desc: "Maps evidence & testimony to charges.", icon: Network, demo: () => "Charge u/s 420 IPC ↔ Witness PW-3 + Exhibit P-12 (bank statement) · gap detected at PW-5." },
  { n: 17, title: "Opposing Counsel Intelligence", desc: "Win/loss metrics & past judgments.", icon: UserSearch, demo: () => "Adv. S. Khan · 38W / 12L (last 24m) · avg adjournments sought: 2.4 per matter." },
  { n: 18, title: "Judicial Analytics", desc: "Bench tendencies & order frequency trends.", icon: BarChart3, demo: () => "Hon'ble Justice Rao · grants interim relief in 41% of IP suits · avg disposal 14 months." },
  { n: 19, title: "Conflict-of-Interest Scanner", desc: "Scans firm DB before onboarding new client.", icon: ShieldAlert, demo: () => "Scan complete · 0 conflicts · 1 advisory match (shared director with existing client)." },
  { n: 20, title: "Interactive Case Timeline", desc: "Horizontal litigation roadmap.", icon: GitBranch, demo: () => "Timeline rendered · 17 milestones · next critical event in 5 days." },
  { n: 21, title: "Notice Follow-up Tracker", desc: "Alerts when 15/30 day notice periods expire.", icon: Bell, demo: () => "3 NI Act 138 notices expiring this week · auto-reminder scheduled." },
  { n: 22, title: "Virtual Consultation (WebRTC)", desc: "Secure embedded video inside client portal.", icon: Video, demo: () => "Room vajra-7a3d2 ready · E2EE · join link copied." },
  { n: 23, title: "Firm Profitability BI", desc: "Revenue per matter & attorney performance.", icon: BarChart3, demo: () => "Q2 net margin 34.2% · top performer: Sr. Adv. Iyer (₹1.8 Cr billed)." },
  { n: 24, title: "Document Version Controller", desc: "Git-like history for plaints & WS.", icon: GitBranch, demo: () => "Plaint v14 · 3 branches · last diff: +42 / −7 in para 12 (cause of action)." },
  { n: 25, title: "Aadhaar e-Sign / eMudhra", desc: "Compliant secure e-signatures.", icon: Stamp, demo: () => "OTP sent to ******1234 · awaiting Aadhaar e-Sign confirmation." },
  { n: 26, title: "Bare Acts Deep Linker", desc: "Auto-link to latest BNS/BNSS/BSA.", icon: BookOpen, demo: () => "Detected 9 statute refs · linked to BNS s.318, BNSS s.479, BSA s.65 (current text)." },
  { n: 27, title: "Offline-First Cache", desc: "Works inside basement courtrooms.", icon: WifiOff, demo: () => "Offline cache: 84 MB · last sync 12m ago · 0 conflicts pending." },
  { n: 28, title: "Bulk CSV/Excel Importer", desc: "Shift thousands of legacy files instantly.", icon: FileUp, demo: () => "Imported 1,247 matters · 12 warnings (date format) · 0 hard errors." },
  { n: 29, title: "WhatsApp Lead Intake", desc: "Auto-pulls prospective clients into CRM.", icon: MessageSquare, demo: () => "5 new leads captured (last 24h) · 2 auto-qualified as 'High-Value Commercial'." },
  { n: 30, title: "Smart Redaction Tool", desc: "AI blurs Aadhaar/bank info pre-submission.", icon: EyeOff, demo: () => "Redacted 7 fields (Aadhaar, A/c, mobile) across 3 pages · safe to publish." },
  { n: 31, title: "Courtroom Simulation (Moot)", desc: "AI plays aggressive opposing counsel/judge.", icon: Swords, demo: () => "Simulation ready · Mode: Hostile Cross · 12 likely questions generated." },
  { n: 32, title: "Escrow & Trust Accounting", desc: "Bar-Council compliant client trust funds.", icon: Banknote, demo: () => "Escrow A/c · ₹42,18,500 across 17 clients · last reconciliation: clean." },
  { n: 33, title: "FEMA / Sanctions Scanner", desc: "OFAC, UN, RBI compliance cross-check.", icon: Globe2, demo: () => "Client cleared on OFAC, UN-1267, RBI Caution List · no hits." },
  { n: 34, title: "Asset Discovery Mapper", desc: "Director, shell company & asset graph.", icon: Briefcase, demo: () => "Mapped 14 entities, 9 directors, 3 likely shell links flagged amber." },
  { n: 35, title: "Senior Advocate Brief Panel", desc: "One-page distilled brief for Sr. Advs.", icon: Crown, demo: () => "Brief prepared for Sr. Adv. Singhvi · 1 page · 6 propositions · 4 precedents." },
  { n: 36, title: "Media & PR Crisis Monitor", desc: "Tracks press & social for sensitive matters.", icon: Newspaper, demo: () => "2 new mentions (Bar & Bench, LiveLaw) · sentiment: neutral · alert sent to PR." },
  { n: 37, title: "Dark-Web Leak Alerts", desc: "Scans dark-web for firm credentials/briefs.", icon: Skull, demo: () => "Last scan 3h ago · 0 firm assets exposed · 1 advisory (employee email in old breach)." },
  { n: 38, title: "M&A Due Diligence Pipeline", desc: "Parses contracts; flags CoC & indemnities.", icon: Building2, demo: () => "327 contracts parsed · 41 change-of-control · 12 uncapped indemnities flagged." },
  { n: 39, title: "Travel & Logistics Tracker", desc: "PNR, flights, hotels for outstation matters.", icon: Plane, demo: () => "Tomorrow: 6E-237 DEL→BOM 06:10 · Hotel: Taj Lands End · Court: BHC Court 21 @ 11:00." },
  { n: 40, title: "Web3 Smart-Contract Audit Log", desc: "IP, tokenomics, NFT title parameters.", icon: Boxes, demo: () => "Contract 0xA1…b9F audited · 2 medium findings (re-entrancy guard, owner-only mint)." },
  { n: 41, title: "AI Precedent & Citation Finder", desc: "Scans landmark SC/HC judgments for matching ratios.", icon: Search, demo: () => "Top match: (2019) 8 SCC 1 · ratio 91% · 4 supporting cites identified." },
  { n: 42, title: "Litigation Outcome Predictor", desc: "Win probability from historically similar cases.", icon: TrendingUp, demo: () => "Predicted win probability: 73% · key driver: documentary evidence strength." },
  { n: 43, title: "Supreme Court SLP Feasibility Analyzer", desc: "Checks if HC order qualifies for SLP grounds.", icon: FileCheck, demo: () => "SLP feasibility: STRONG · grounds: substantial Q of law u/Art 136 · 2 prior SLPs cited." },
  { n: 44, title: "Inter-State Jurisdiction Scanner", desc: "Flags HC jurisdictional conflicts across states.", icon: MapPin, demo: () => "Cause of action: MH + DL · proper forum: BHC · DHC objection likely u/s 20 CPC." },
  { n: 45, title: "Courtroom Exhibit Digital Presenter", desc: "Cast exhibits to court monitors securely.", icon: MonitorPlay, demo: () => "Casting Exhibit P-12 to Court 4 display · latency 38ms · watermark active." },
  { n: 46, title: "Joint Defence Workspace", desc: "Shared encrypted folders for co-counsels.", icon: FolderLock, demo: () => "Workspace 'State v. 7 accused' · 4 co-counsels · 312 files · privilege log active." },
  { n: 47, title: "Limitation Period Reverse Clock", desc: "Visual countdown for filing deadlines.", icon: Hourglass, demo: () => "Appeal u/s 96 CPC · 23 days, 4 hours remaining · auto-alert at T-7 days." },
  { n: 48, title: "Pro-Bono & CSR Tracker", desc: "Logs free legal-aid hours for compliance.", icon: HeartHandshake, demo: () => "FY26 pro-bono: 184 hrs across 12 matters · meets BCI 50-hr norm ✓." },
  { n: 49, title: "IBC Resolution Timeline Matrix", desc: "NCLT corporate insolvency stage tracker.", icon: Landmark, demo: () => "CIRP Day 142/180 · CoC vote pending · RA submissions: 3 · liquidation risk: medium." },
  { n: 50, title: "IPR Infringement Radar", desc: "Scans patent, trademark, copyright DBs.", icon: Radar, demo: () => "3 trademark hits (Class 9) · 1 copyright takedown ready · 0 patent conflicts." },
  { n: 51, title: "Assign Client to Assistant", desc: "Lawyer assigns clients to assistants; lawyer remains primary owner.", icon: UserCog, demo: () => "Client 'Acme Corp' assigned to Assistant Priya R. · Lawyer Adv. Mehra retained as primary · 3 tasks delegated." },
];

function FeaturesPage() {
  const [open, setOpen] = useState<Feature | null>(null);
  const [output, setOutput] = useState<string>("");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Capabilities</h1>
        <p className="text-muted-foreground">All 51 super-advanced modules of law.aflix.co.in. Click any tile to run it.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {FEATURES.map((f) => (
          <button
            key={f.n}
            onClick={() => { setOpen(f); setOutput(""); }}
            className="group rounded-2xl border border-border bg-card p-5 text-left transition-all hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-elegant"
          >
            <div className="flex items-start justify-between">
              <div className="grid h-10 w-10 place-items-center rounded-xl gradient-gold text-gold-foreground">
                <f.icon className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">#{String(f.n).padStart(2, "0")}</span>
            </div>
            <div className="mt-3 font-display text-base font-bold leading-tight">{f.title}</div>
            <div className="mt-1 text-xs text-muted-foreground">{f.desc}</div>
            <div className="mt-3 text-[11px] font-medium text-gold opacity-0 transition-opacity group-hover:opacity-100">Run module →</div>
          </button>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-black/60 p-4" onClick={() => setOpen(null)}>
          <div className="w-full max-w-lg rounded-2xl border border-gold/30 bg-card p-6 shadow-elegant" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl gradient-gold text-gold-foreground"><open.icon className="h-5 w-5" /></div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Module #{String(open.n).padStart(2, "0")}</div>
                <div className="font-display text-lg font-bold">{open.title}</div>
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{open.desc}</p>
            <button
              onClick={() => setOutput(open.demo?.() ?? "Module executed.")}
              className="mt-4 inline-flex items-center gap-2 rounded-lg gradient-gold px-4 py-2 text-sm font-semibold text-gold-foreground"
            >
              <Bot className="h-4 w-4" /> Execute module
            </button>
            {output && (
              <div className="mt-4 rounded-xl border border-border bg-muted/40 p-4 text-sm">
                <div className="mb-1 text-[10px] uppercase tracking-widest text-gold">Live output</div>
                {output}
              </div>
            )}
            <div className="mt-5 flex justify-end">
              <button onClick={() => setOpen(null)} className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-accent">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
