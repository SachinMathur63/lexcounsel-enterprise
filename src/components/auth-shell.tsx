import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RoyalLogo } from "@/components/royal-logo";

export function AuthShell({
  title, subtitle, children, footer,
}: { title: string; subtitle: string; children: React.ReactNode; footer: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between gradient-navy p-12 text-white lg:flex">
        <Link to="/" className="flex items-center gap-3">
          <RoyalLogo size={40} />
          <div className="leading-tight">
            <div className="font-display text-lg font-bold">AFLIX LEGAL SOLUTIONS</div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-gold">Pvt. Ltd. · LPMS</div>
          </div>
        </Link>
        <div className="relative">
          <div className="pointer-events-none absolute -inset-20 bg-gradient-to-br from-gold/20 to-transparent blur-3xl" />
          <blockquote className="relative">
            <p className="font-display text-3xl leading-snug">
              "Aflix is the apex operating system of Indian legal practice — every CNR, every cause list, every order, one console."
            </p>
            <footer className="mt-4 text-sm text-white/70">— Senior Advocate, Supreme Court of India</footer>
          </blockquote>
        </div>
        <div className="text-xs text-white/50">© {new Date().getFullYear()} AFLIX LEGAL SOLUTIONS PVT. LTD. Bank-grade security.</div>
      </div>
      <div className="flex items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-8 flex items-center gap-2 lg:hidden">
            <RoyalLogo size={32} />
            <span className="font-display text-base font-bold">AFLIX LEGAL SOLUTIONS</span>
          </Link>
          <h1 className="font-display text-3xl font-bold">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <div className="mt-8 text-sm text-muted-foreground">{footer}</div>
        </div>
      </div>
    </div>
  );
}

export function GoogleButton({ onClick }: { onClick: () => void }) {
  return (
    <Button type="button" variant="outline" className="h-11 w-full gap-3" onClick={onClick}>
      <svg className="h-4 w-4" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/>
        <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16.1 19 13 24 13c3 0 5.7 1.1 7.8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
        <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.4-4.5 2.4-7.2 2.4-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
        <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.1 5.6l6.2 5.2c-.4.4 6.6-4.8 6.6-14.8 0-1.3-.1-2.4-.4-3.5z"/>
      </svg>
      Continue with Google
    </Button>
  );
}

export function OtpModal({
  open, email, onVerify, onClose,
}: { open: boolean; email: string; onVerify: () => void; onClose: () => void }) {
  const [otp] = useState(() => Math.floor(100000 + Math.random() * 900000).toString());
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl glass p-8 shadow-elegant" onClick={(e) => e.stopPropagation()}>
        <div className="mb-1 font-display text-2xl font-bold">Verify your identity</div>
        <p className="text-sm text-muted-foreground">We've sent a 6-digit code to <span className="font-medium text-foreground">{email}</span></p>
        <div className="mt-6 rounded-xl border-2 border-dashed border-gold/40 bg-gold/5 p-5 text-center">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Your verification code</div>
          <div className="mt-2 font-display text-4xl font-bold tracking-[0.5em] text-gradient-gold">{otp}</div>
          <button
            onClick={() => { navigator.clipboard?.writeText(otp); setInput(otp); }}
            className="mt-3 text-xs font-medium text-gold hover:underline"
          >Copy code</button>
        </div>
        <input
          autoFocus value={input} onChange={(e) => setInput(e.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder="Enter 6-digit code"
          className="mt-5 h-12 w-full rounded-lg border border-input bg-background px-4 text-center font-mono text-xl tracking-[0.4em] focus:outline-none focus:ring-2 focus:ring-gold"
        />
        <Button
          variant="gold"
          className="mt-4 h-11 w-full"
          disabled={input !== otp}
          onClick={() => { onVerify(); navigate({ to: "/app/dashboard" }); }}
        >
          Verify & continue
        </Button>
        <button onClick={onClose} className="mt-3 w-full text-xs text-muted-foreground hover:text-foreground">Cancel</button>
      </div>
    </div>
  );
}
