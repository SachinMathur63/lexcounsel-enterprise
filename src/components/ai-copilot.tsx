import { useEffect, useRef, useState } from "react";
import { Sparkles, X, Send, Paperclip, Loader2, FileText } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(",")[1] || "");
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

export function AICopilot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "assistant", content: "**Vajra AI Copilot** at your service, counselor. Ask for citations, draft a bail application, or drop a plaint/FIR/order copy here to analyse." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [drag, setDrag] = useState(false);
  const [attached, setAttached] = useState<File | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { scrollRef.current?.scrollTo({ top: 9e9, behavior: "smooth" }); }, [msgs, loading]);

  const send = async (overrideText?: string, file?: File) => {
    const text = (overrideText ?? input).trim();
    const f = file ?? attached;
    if (!text && !f) return;
    setLoading(true); setInput(""); setAttached(null);

    const userDisplay = f ? `${text || "Analyse this document."}\n\n📎 ${f.name}` : text;
    const next = [...msgs, { role: "user" as const, content: userDisplay }];
    setMsgs(next);

    let userContent: unknown = text || "Analyse this document.";
    if (f) {
      const b64 = await fileToBase64(f);
      const mime = f.type || "application/octet-stream";
      if (mime.startsWith("image/")) {
        userContent = [
          { type: "text", text: text || "Analyse this legal document image. Extract key facts, issues, weaknesses." },
          { type: "image_url", image_url: { url: `data:${mime};base64,${b64}` } },
        ];
      } else {
        userContent = [
          { type: "text", text: text || "Analyse this legal document. Extract key facts, issues, weaknesses." },
          { type: "file", file: { filename: f.name, file_data: `data:${mime || "application/pdf"};base64,${b64}` } },
        ];
      }
    }

    try {
      const apiMessages = next.slice(0, -1).map((m) => ({ role: m.role, content: m.content }));
      apiMessages.push({ role: "user", content: userContent as string });
      const res = await fetch("/api/ai-copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });
      if (!res.ok) {
        const errText = await res.text();
        setMsgs((m) => [...m, { role: "assistant", content: `⚠️ ${res.status === 429 ? "Rate limit reached, try again shortly." : res.status === 402 ? "AI credits exhausted — please top up Lovable AI." : errText || "Request failed."}` }]);
      } else {
        const data = await res.json();
        setMsgs((m) => [...m, { role: "assistant", content: data.text || "(no response)" }]);
      }
    } catch (e) {
      setMsgs((m) => [...m, { role: "assistant", content: `⚠️ Network error: ${String(e)}` }]);
    } finally { setLoading(false); }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDrag(false);
    const f = e.dataTransfer.files?.[0];
    if (f) void send("Analyse this document.", f);
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full gradient-gold text-gold-foreground shadow-glow transition-transform hover:scale-105"
          aria-label="Open Vajra AI Copilot"
        >
          <Sparkles className="h-6 w-6" />
        </button>
      )}
      {open && (
        <div
          className={`fixed bottom-5 right-5 z-50 flex h-[min(640px,calc(100vh-2.5rem))] w-[min(420px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-gold/30 bg-card shadow-elegant ${drag ? "ring-2 ring-gold" : ""}`}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={onDrop}
        >
          <div className="flex items-center justify-between border-b border-border bg-gradient-to-r from-[#0b1633] to-[#121212] px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg gradient-gold"><Sparkles className="h-4 w-4 text-gold-foreground" /></div>
              <div>
                <div className="font-display text-sm font-bold">Vajra AI Copilot</div>
                <div className="text-[10px] uppercase tracking-wider text-white/60">Always-on · Drop a document</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="rounded-lg p-1.5 hover:bg-white/10" aria-label="Close"><X className="h-4 w-4" /></button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm ${m.role === "user" ? "gradient-gold text-gold-foreground" : "bg-muted text-foreground"}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && <div className="flex items-center gap-2 text-xs text-muted-foreground"><Loader2 className="h-3.5 w-3.5 animate-spin" /> Analysing…</div>}
            {drag && <div className="rounded-xl border-2 border-dashed border-gold/60 p-6 text-center text-sm text-gold">Drop document to analyse</div>}
          </div>

          {attached && (
            <div className="flex items-center gap-2 border-t border-border bg-muted/40 px-3 py-2 text-xs">
              <FileText className="h-3.5 w-3.5 text-gold" /> <span className="truncate">{attached.name}</span>
              <button onClick={() => setAttached(null)} className="ml-auto text-muted-foreground hover:text-foreground"><X className="h-3 w-3" /></button>
            </div>
          )}

          <div className="border-t border-border bg-background p-3">
            <div className="flex items-end gap-2">
              <label className="grid h-10 w-10 cursor-pointer place-items-center rounded-lg border border-border hover:bg-accent" aria-label="Attach">
                <Paperclip className="h-4 w-4" />
                <input type="file" className="hidden" accept=".pdf,.png,.jpg,.jpeg,.webp,.txt" onChange={(e) => setAttached(e.target.files?.[0] ?? null)} />
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void send(); } }}
                placeholder="Ask Vajra AI… (Shift+Enter for newline)"
                rows={1}
                className="max-h-32 min-h-10 flex-1 resize-none rounded-lg border border-input bg-muted/40 px-3 py-2 text-sm focus:bg-background focus:outline-none focus:ring-2 focus:ring-gold"
              />
              <button
                onClick={() => void send()}
                disabled={loading || (!input.trim() && !attached)}
                className="grid h-10 w-10 place-items-center rounded-lg gradient-gold text-gold-foreground disabled:opacity-40"
                aria-label="Send"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-1.5 text-[10px] text-muted-foreground">Drop a PDF/image anywhere in this panel to analyse instantly.</div>
          </div>
        </div>
      )}
    </>
  );
}
