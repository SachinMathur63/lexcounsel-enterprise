import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Upload, Search, FileText, Image as ImageIcon, FileSpreadsheet, File, Folder, Download, Trash2, Eye } from "lucide-react";
import { store, useStore, uid, type Doc } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { PageHeader, Modal } from "@/components/page-header";
import { toast } from "sonner";

export const Route = createFileRoute("/app/documents")({
  head: () => ({ meta: [{ title: "Documents — Lex Counsel" }] }),
  component: Documents,
});

const FOLDERS = ["All", "Contracts", "Estates", "Evidence", "Financials", "Pleadings"];

function Documents() {
  const docs = useStore((s) => s.docs);
  const [folder, setFolder] = useState("All");
  const [q, setQ] = useState("");
  const [preview, setPreview] = useState<Doc | null>(null);

  const filtered = docs
    .filter((d) => folder === "All" || d.folder === folder)
    .filter((d) => d.name.toLowerCase().includes(q.toLowerCase()));

  const mockUpload = () => {
    const types = ["pdf", "docx", "xlsx", "jpg"];
    const t = types[Math.floor(Math.random() * types.length)];
    const d: Doc = {
      id: uid(),
      name: `Document_${Date.now().toString().slice(-5)}.${t}`,
      folder: folder === "All" ? "Contracts" : folder,
      type: t,
      size: Math.floor(Math.random() * 2000000) + 50000,
      uploadedAt: new Date().toISOString().slice(0, 10),
    };
    store.set((s) => ({ docs: [d, ...s.docs] }));
    toast.success("File uploaded");
  };

  const remove = (id: string) => {
    store.set((s) => ({ docs: s.docs.filter((d) => d.id !== id) }));
    toast.success("Deleted");
  };

  return (
    <div>
      <PageHeader title="Documents" subtitle="Secure file vault for your firm"
        action={<Button variant="gold" onClick={mockUpload}><Upload className="h-4 w-4" /> Upload</Button>} />

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside className="rounded-2xl border border-border bg-card p-3">
          <div className="px-2 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Folders</div>
          {FOLDERS.map((f) => (
            <button key={f} onClick={() => setFolder(f)}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm ${folder === f ? "gradient-gold text-gold-foreground font-semibold" : "hover:bg-accent"}`}>
              <Folder className="h-4 w-4" /> {f}
            </button>
          ))}
        </aside>
        <div>
          <div className="relative mb-4 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search documents..."
              className="h-10 w-full rounded-lg border border-input bg-muted/40 pl-10 pr-3 text-sm focus:bg-background focus:outline-none focus:ring-2 focus:ring-gold" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((d) => (
              <div key={d.id} className="group rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-elegant">
                <div className="mb-3 flex h-28 items-center justify-center rounded-lg bg-muted/50">
                  <FileIcon type={d.type} />
                </div>
                <div className="truncate text-sm font-medium">{d.name}</div>
                <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{d.folder}</span><span>{(d.size / 1024).toFixed(0)} KB</span>
                </div>
                <div className="mt-3 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button onClick={() => setPreview(d)} className="flex-1 rounded-md bg-muted py-1.5 text-xs hover:bg-accent flex items-center justify-center gap-1"><Eye className="h-3 w-3" />Preview</button>
                  <button onClick={() => toast.success("Download started")} className="rounded-md bg-muted px-2 py-1.5 hover:bg-accent"><Download className="h-3 w-3" /></button>
                  <button onClick={() => remove(d.id)} className="rounded-md bg-muted px-2 py-1.5 text-destructive hover:bg-destructive/10"><Trash2 className="h-3 w-3" /></button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && <div className="col-span-full rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">No documents.</div>}
          </div>
        </div>
      </div>

      <Modal open={!!preview} onClose={() => setPreview(null)} title={preview?.name || ""}>
        {preview && (
          <div>
            <div className="mb-4 grid h-64 place-items-center rounded-xl bg-muted">
              <div className="text-center">
                <FileIcon type={preview.type} large />
                <div className="mt-3 text-sm text-muted-foreground">{preview.type.toUpperCase()} preview</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Info label="Folder" value={preview.folder} />
              <Info label="Type" value={preview.type.toUpperCase()} />
              <Info label="Size" value={`${(preview.size / 1024).toFixed(0)} KB`} />
              <Info label="Uploaded" value={preview.uploadedAt} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div><div className="text-xs text-muted-foreground">{label}</div><div className="font-medium">{value}</div></div>;
}

function FileIcon({ type, large }: { type: string; large?: boolean }) {
  const sz = large ? "h-16 w-16" : "h-10 w-10";
  const map: Record<string, { icon: any; color: string }> = {
    pdf: { icon: FileText, color: "text-destructive" },
    docx: { icon: FileText, color: "text-info" },
    xlsx: { icon: FileSpreadsheet, color: "text-success" },
    jpg: { icon: ImageIcon, color: "text-gold" },
    png: { icon: ImageIcon, color: "text-gold" },
  };
  const I = (map[type] || { icon: File, color: "text-muted-foreground" });
  return <I.icon className={`${sz} ${I.color}`} />;
}
