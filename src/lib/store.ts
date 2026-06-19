// Lightweight reactive store using localStorage + custom event emitter.
import { useSyncExternalStore } from "react";

type Listener = () => void;
const listeners = new Set<Listener>();
const emit = () => listeners.forEach((l) => l());
const subscribe = (l: Listener) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

const KEY = "lms_state_v1";

export type User = { id: string; name: string; email: string; role: "lawyer" | "paralegal" | "client" };
export type Client = { id: string; name: string; email: string; phone: string; company?: string; createdAt: string };
export type Case = {
  id: string; title: string; number: string; clientId: string; opposingParty: string;
  priority: "Low" | "Medium" | "High" | "Critical"; status: "Open" | "In Progress" | "On Hold" | "Closed";
  court: string; createdAt: string;
};
export type Hearing = { id: string; caseId: string; title: string; date: string; time: string; location: string; reminder: boolean; notes?: string };
export type Doc = { id: string; name: string; folder: string; type: string; size: number; uploadedAt: string };
export type Task = { id: string; title: string; description?: string; assignee: string; status: "Pending" | "In Progress" | "Completed"; deadline: string; priority: "Low" | "Medium" | "High" };
export type Invoice = { id: string; number: string; clientId: string; amount: number; status: "Paid" | "Pending" | "Overdue"; issued: string; due: string; items: { desc: string; qty: number; rate: number }[] };
export type Notification = { id: string; title: string; message: string; time: string; read: boolean };

export type State = {
  user: User | null;
  isAdmin: boolean;
  theme: "light" | "dark";
  clients: Client[];
  cases: Case[];
  hearings: Hearing[];
  docs: Doc[];
  tasks: Task[];
  invoices: Invoice[];
  notifications: Notification[];
};

const seed = (): State => ({
  user: null,
  isAdmin: false,
  theme: "dark",
  clients: [
    { id: "c1", name: "Acme Corporation", email: "legal@acme.com", phone: "+1 555 0101", company: "Acme Corp", createdAt: "2025-01-10" },
    { id: "c2", name: "Jane Whitfield", email: "jane@whitfield.co", phone: "+1 555 0177", createdAt: "2025-02-22" },
    { id: "c3", name: "Northwind Holdings", email: "contact@northwind.io", phone: "+1 555 0312", company: "Northwind", createdAt: "2025-03-15" },
  ],
  cases: [
    { id: "k1", title: "Acme v. Globex IP Dispute", number: "CIV-2025-001", clientId: "c1", opposingParty: "Globex Inc.", priority: "High", status: "In Progress", court: "Federal District Court", createdAt: "2025-03-01" },
    { id: "k2", title: "Whitfield Estate Settlement", number: "PRB-2025-014", clientId: "c2", opposingParty: "N/A", priority: "Medium", status: "Open", court: "Probate Court", createdAt: "2025-04-12" },
    { id: "k3", title: "Northwind Merger Review", number: "CRP-2025-088", clientId: "c3", opposingParty: "Initech LLC", priority: "Critical", status: "In Progress", court: "Commercial Court", createdAt: "2025-05-04" },
    { id: "k4", title: "Acme Trademark Renewal", number: "TM-2024-220", clientId: "c1", opposingParty: "N/A", priority: "Low", status: "Closed", court: "USPTO", createdAt: "2024-11-19" },
  ],
  hearings: [
    { id: "h1", caseId: "k1", title: "Pre-trial Conference", date: nextDate(2), time: "10:00", location: "Courtroom 4B", reminder: true },
    { id: "h2", caseId: "k3", title: "Motion Hearing", date: nextDate(5), time: "14:30", location: "Courtroom 2A", reminder: true },
    { id: "h3", caseId: "k2", title: "Status Update", date: nextDate(9), time: "09:15", location: "Probate Hall", reminder: false },
  ],
  docs: [
    { id: "d1", name: "Contract_Acme_v3.pdf", folder: "Contracts", type: "pdf", size: 482000, uploadedAt: "2025-05-01" },
    { id: "d2", name: "Whitfield_Will.docx", folder: "Estates", type: "docx", size: 92000, uploadedAt: "2025-04-20" },
    { id: "d3", name: "Evidence_Photo_01.jpg", folder: "Evidence", type: "jpg", size: 2100000, uploadedAt: "2025-05-12" },
    { id: "d4", name: "Northwind_Financials.xlsx", folder: "Financials", type: "xlsx", size: 320000, uploadedAt: "2025-05-15" },
  ],
  tasks: [
    { id: "t1", title: "Draft motion to dismiss", assignee: "Sarah K.", status: "In Progress", deadline: nextDate(3), priority: "High" },
    { id: "t2", title: "Review discovery documents", assignee: "Mark T.", status: "Pending", deadline: nextDate(6), priority: "Medium" },
    { id: "t3", title: "Client intake call - Northwind", assignee: "You", status: "Completed", deadline: nextDate(-1), priority: "Low" },
    { id: "t4", title: "File appellate brief", assignee: "You", status: "Pending", deadline: nextDate(10), priority: "High" },
  ],
  invoices: [
    { id: "i1", number: "INV-2025-001", clientId: "c1", amount: 12500, status: "Paid", issued: "2025-04-01", due: "2025-04-30", items: [{ desc: "Litigation services - March", qty: 25, rate: 500 }] },
    { id: "i2", number: "INV-2025-002", clientId: "c2", amount: 4800, status: "Pending", issued: "2025-05-10", due: "2025-06-10", items: [{ desc: "Estate planning consultation", qty: 12, rate: 400 }] },
    { id: "i3", number: "INV-2025-003", clientId: "c3", amount: 22000, status: "Overdue", issued: "2025-03-15", due: "2025-04-15", items: [{ desc: "Merger advisory", qty: 40, rate: 550 }] },
  ],
  notifications: [
    { id: "n1", title: "Hearing tomorrow", message: "Acme v. Globex at 10:00 AM", time: "2h ago", read: false },
    { id: "n2", title: "Invoice overdue", message: "INV-2025-003 from Northwind is overdue", time: "1d ago", read: false },
    { id: "n3", title: "New document uploaded", message: "Contract_Acme_v3.pdf added to Contracts", time: "3d ago", read: true },
  ],
});

function nextDate(daysFromNow: number) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().slice(0, 10);
}

let state: State = load();

function load(): State {
  if (typeof window === "undefined") return seed();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seed();
    return { ...seed(), ...JSON.parse(raw) };
  } catch {
    return seed();
  }
}

function persist() {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
}

export const store = {
  get: () => state,
  set: (updater: (s: State) => Partial<State>) => {
    state = { ...state, ...updater(state) };
    persist();
    emit();
  },
  subscribe,
};

export function useStore<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(state),
    () => selector(state),
  );
}

export const uid = () => Math.random().toString(36).slice(2, 10);

// Theme management
if (typeof window !== "undefined") {
  const apply = () => {
    document.documentElement.classList.toggle("dark", state.theme === "dark");
  };
  apply();
  subscribe(apply);
}
