import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Shield, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { store } from "@/lib/store";
import { toast } from "sonner";

const ADMIN_USERNAME = "lexcounsel";
const ADMIN_PASSWORD = "nandini@123";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "Admin Login — Lex Counsel" }] }),
  component: AdminLogin,
});

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().toLowerCase() === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      store.set(() => ({
        user: { id: "admin", name: "Administrator", email: "admin@lexcounsel.app", role: "lawyer" },
        isAdmin: true,
      }));
      toast.success("Admin access granted");
      navigate({ to: "/admin/dashboard" });
    } else {
      setErr("Invalid administrator credentials");
    }
  };

  return (
    <div className="grid min-h-screen place-items-center gradient-navy px-6">
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/20 blur-3xl" />
      </div>
      <div className="relative w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="grid h-16 w-16 place-items-center rounded-2xl gradient-gold shadow-glow">
            <Shield className="h-8 w-8 text-gold-foreground" />
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <h1 className="text-center font-display text-2xl font-bold text-white">Administrator Access</h1>
          <p className="mt-1 text-center text-sm text-white/60">Restricted gateway. Authorized personnel only.</p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/70">Username</label>
              <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="lexcounsel"
                className="h-11 w-full rounded-lg border border-white/15 bg-white/5 px-3.5 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-gold" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/70">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                className="h-11 w-full rounded-lg border border-white/15 bg-white/5 px-3.5 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-gold" />
            </div>
            {err && <p className="text-sm text-destructive">{err}</p>}
            <Button type="submit" variant="gold" className="h-11 w-full">
              <Lock className="h-4 w-4" /> Authenticate
            </Button>
          </form>
          <div className="mt-6 rounded-lg border border-gold/20 bg-gold/10 p-3 text-xs text-white/70">
            <div className="font-medium text-gold">Demo credentials</div>
            Username: <span className="font-mono">lexcounsel</span> · Password: <span className="font-mono">nandini@123</span>
          </div>
        </div>
        <Link to="/" className="mt-6 block text-center text-sm text-white/60 hover:text-white">← Back to website</Link>
      </div>
    </div>
  );
}
