import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, MapPin, Clock, Bell } from "lucide-react";
import { store, useStore, uid, type Hearing } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { PageHeader, Modal, Field, inputCls } from "@/components/page-header";
import { toast } from "sonner";

export const Route = createFileRoute("/app/calendar")({
  head: () => ({ meta: [{ title: "Hearings — Lex Counsel" }] }),
  component: CalendarPage,
});

function CalendarPage() {
  const hearings = useStore((s) => s.hearings);
  const cases = useStore((s) => s.cases);
  const [cursor, setCursor] = useState(new Date());
  const [selected, setSelected] = useState<Hearing | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const y = cursor.getFullYear(), m = cursor.getMonth();
  const first = new Date(y, m, 1);
  const startDay = first.getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const monthName = first.toLocaleString("en", { month: "long", year: "numeric" });
  const todayStr = new Date().toISOString().slice(0, 10);

  const hearingsFor = (day: number) => {
    const s = new Date(y, m, day).toISOString().slice(0, 10);
    return hearings.filter((h) => h.date === s);
  };

  const save = (h: Hearing) => {
    store.set((s) => ({ hearings: [h, ...s.hearings] }));
    toast.success("Hearing scheduled");
    setAddOpen(false);
  };

  return (
    <div>
      <PageHeader title="Hearing Calendar" subtitle="Court schedule with reminders"
        action={<Button variant="gold" onClick={() => setAddOpen(true)}><Plus className="h-4 w-4" /> Add hearing</Button>} />

      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="font-display text-2xl font-bold">{monthName}</div>
          <div className="flex gap-1">
            <Button variant="outline" size="icon" onClick={() => setCursor(new Date(y, m - 1, 1))}><ChevronLeft className="h-4 w-4" /></Button>
            <Button variant="outline" size="sm" onClick={() => setCursor(new Date())}>Today</Button>
            <Button variant="outline" size="icon" onClick={() => setCursor(new Date(y, m + 1, 1))}><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="py-2 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">{d}</div>
          ))}
          {cells.map((d, i) => {
            if (d === null) return <div key={i} />;
            const dayHearings = hearingsFor(d);
            const dateStr = new Date(y, m, d).toISOString().slice(0, 10);
            const isToday = dateStr === todayStr;
            return (
              <div key={i} className={`min-h-24 rounded-xl border p-2 transition-colors ${isToday ? "border-gold bg-gold/5" : "border-border bg-background"}`}>
                <div className={`text-xs font-semibold ${isToday ? "text-gold" : "text-muted-foreground"}`}>{d}</div>
                <div className="mt-1 space-y-1">
                  {dayHearings.map((h) => (
                    <button key={h.id} onClick={() => setSelected(h)}
                      className="block w-full truncate rounded-md gradient-gold px-1.5 py-1 text-left text-[10px] font-semibold text-gold-foreground hover:opacity-90">
                      {h.time} {h.title}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.title || ""}>
        {selected && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm"><Clock className="h-4 w-4 text-gold" />{selected.date} at {selected.time}</div>
            <div className="flex items-center gap-2 text-sm"><MapPin className="h-4 w-4 text-gold" />{selected.location}</div>
            <div className="rounded-lg bg-muted p-3 text-sm">
              <div className="text-xs uppercase text-muted-foreground">Case</div>
              {cases.find((c) => c.id === selected.caseId)?.title || "—"}
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" defaultChecked={selected.reminder} className="rounded" /> <Bell className="h-3.5 w-3.5" /> Send reminder 1 day before
            </label>
          </div>
        )}
      </Modal>

      <AddHearing open={addOpen} onClose={() => setAddOpen(false)} onSave={save} cases={cases} />
    </div>
  );
}

function AddHearing({ open, onClose, onSave, cases }: { open: boolean; onClose: () => void; onSave: (h: Hearing) => void; cases: { id: string; title: string }[] }) {
  const [form, setForm] = useState<Hearing>({ id: uid(), caseId: cases[0]?.id || "", title: "", date: new Date().toISOString().slice(0, 10), time: "10:00", location: "", reminder: true });
  return (
    <Modal open={open} onClose={onClose} title="Schedule hearing">
      <form onSubmit={(e) => { e.preventDefault(); if (!form.title) return; onSave({ ...form, id: uid() }); }} className="space-y-4">
        <Field label="Title"><input className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></Field>
        <Field label="Case">
          <select className={inputCls} value={form.caseId} onChange={(e) => setForm({ ...form, caseId: e.target.value })}>
            {cases.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Date"><input type="date" className={inputCls} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></Field>
          <Field label="Time"><input type="time" className={inputCls} value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} /></Field>
        </div>
        <Field label="Location"><input className={inputCls} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></Field>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.reminder} onChange={(e) => setForm({ ...form, reminder: e.target.checked })} /> Set reminder
        </label>
        <div className="flex justify-end gap-2"><Button type="button" variant="ghost" onClick={onClose}>Cancel</Button><Button type="submit" variant="gold">Schedule</Button></div>
      </form>
    </Modal>
  );
}
