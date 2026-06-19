import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { AuthShell, GoogleButton, OtpModal } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { store, uid } from "@/lib/store";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(80),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Min 8 characters"),
});

export const Route = createFileRoute("/auth/signup")({
  head: () => ({ meta: [{ title: "Create your account — Lex Counsel" }] }),
  component: SignupPage,
});

function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
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

  const complete = () => {
    store.set(() => ({
      user: { id: uid(), name: form.name, email: form.email, role: "lawyer" },
      isAdmin: false,
    }));
    toast.success("Account created!");
  };

  const googleSignup = () => {
    store.set(() => ({
      user: { id: uid(), name: "Google User", email: "user@gmail.com", role: "lawyer" },
      isAdmin: false,
    }));
    toast.success("Account created with Google");
    window.location.href = "/app/dashboard";
  };

  return (
    <>
      <AuthShell
        title="Create your firm account"
        subtitle="Start your 14-day free trial. No credit card required."
        footer={<>Already have an account? <Link to="/auth/login" className="font-medium text-gold hover:underline">Sign in</Link></>}
      >
        <form onSubmit={submit} className="space-y-4">
          <Field label="Full name" error={errors.name}>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Jane Whitfield"
              className="h-11 w-full rounded-lg border border-input bg-background px-3.5 focus:outline-none focus:ring-2 focus:ring-gold" />
          </Field>
          <Field label="Email" error={errors.email}>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@firm.com"
              className="h-11 w-full rounded-lg border border-input bg-background px-3.5 focus:outline-none focus:ring-2 focus:ring-gold" />
          </Field>
          <Field label="Password" error={errors.password}>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="At least 8 characters"
              className="h-11 w-full rounded-lg border border-input bg-background px-3.5 focus:outline-none focus:ring-2 focus:ring-gold" />
          </Field>
          <Button type="submit" variant="gold" className="h-11 w-full">Create account</Button>
        </form>
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">OR</span>
          <div className="h-px flex-1 bg-border" />
        </div>
        <GoogleButton onClick={googleSignup} />
      </AuthShell>
      <OtpModal open={otpOpen} email={form.email} onClose={() => setOtpOpen(false)} onVerify={complete} />
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
