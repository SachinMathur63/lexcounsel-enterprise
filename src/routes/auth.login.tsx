import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { AuthShell, GoogleButton, OtpModal } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { store, uid } from "@/lib/store";
import { toast } from "sonner";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Min 6 characters"),
});

export const Route = createFileRoute("/auth/login")({
  head: () => ({ meta: [{ title: "Sign in — Lex Counsel" }] }),
  component: LoginPage,
});

function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [otpOpen, setOtpOpen] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(form);
    if (!r.success) {
      const errs: Record<string, string> = {};
      r.error.issues.forEach((i) => (errs[i.path[0] as string] = i.message));
      setErrors(errs);
      return;
    }
    setErrors({});
    setOtpOpen(true);
  };

  const completeLogin = () => {
    store.set(() => ({
      user: { id: uid(), name: form.email.split("@")[0], email: form.email, role: "lawyer" },
      isAdmin: false,
    }));
    toast.success("Welcome back!");
  };

  const googleLogin = () => {
    store.set(() => ({
      user: { id: uid(), name: "Google User", email: "user@gmail.com", role: "lawyer" },
      isAdmin: false,
    }));
    toast.success("Signed in with Google");
    window.location.href = "/app/dashboard";
  };

  return (
    <>
      <AuthShell
        title="Welcome back"
        subtitle="Sign in to your firm's workspace"
        footer={<>Don't have an account? <Link to="/auth/signup" className="font-medium text-gold hover:underline">Sign up</Link></>}
      >
        <form onSubmit={submit} className="space-y-4">
          <Field label="Email" error={errors.email}>
            <input
              type="email" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@firm.com"
              className="h-11 w-full rounded-lg border border-input bg-background px-3.5 focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </Field>
          <Field label="Password" error={errors.password}>
            <input
              type="password" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              className="h-11 w-full rounded-lg border border-input bg-background px-3.5 focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </Field>
          <Button type="submit" variant="gold" className="h-11 w-full">Continue</Button>
        </form>
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">OR</span>
          <div className="h-px flex-1 bg-border" />
        </div>
        <GoogleButton onClick={googleLogin} />
      </AuthShell>
      <OtpModal open={otpOpen} email={form.email} onClose={() => setOtpOpen(false)} onVerify={completeLogin} />
    </>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
