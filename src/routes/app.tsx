import { Outlet, Link, useRouterState, useNavigate, redirect, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  LayoutDashboard, Users, Briefcase, Calendar, FileText, CheckSquare,
  Receipt, Bell, Search, Sun, Moon, LogOut, ChevronDown, Settings, Sparkles,
} from "lucide-react";
import { store, useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { RoyalLogo } from "@/components/royal-logo";
import { AICopilot } from "@/components/ai-copilot";

export const Route = createFileRoute("/app")({
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    if (!store.get().user) throw redirect({ to: "/auth/login" });
  },
  component: AppLayout,
});

const navItems = [
  { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/clients", label: "Clients", icon: Users },
  { to: "/app/cases", label: "Cases", icon: Briefcase },
  { to: "/app/calendar", label: "Hearings", icon: Calendar },
  { to: "/app/documents", label: "Documents", icon: FileText },
  { to: "/app/tasks", label: "Tasks", icon: CheckSquare },
  { to: "/app/billing", label: "Billing", icon: Receipt },
] as const;

function AppLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-sidebar text-sidebar-foreground transition-transform lg:static lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-16 items-center gap-2.5 border-b border-sidebar-border px-6">
          <div className="grid h-9 w-9 place-items-center rounded-lg gradient-gold shadow-glow">
            <Scale className="h-5 w-5 text-gold-foreground" />
          </div>
          <span className="font-display text-lg font-bold">Lex Counsel</span>
        </div>
        <nav className="p-3">
          {navItems.map((item) => {
            const active = pathname === item.to || pathname.startsWith(item.to + "/");
            return (
              <Link
                key={item.to} to={item.to} onClick={() => setMobileOpen(false)}
                className={`mb-1 flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm transition-colors ${
                  active ? "gradient-gold text-gold-foreground font-semibold shadow-elegant" : "hover:bg-sidebar-accent"
                }`}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 border-t border-sidebar-border p-3">
          <div className="rounded-lg bg-sidebar-accent p-3 text-xs">
            <div className="font-display text-gold">Pro tip</div>
            <div className="mt-1 text-sidebar-foreground/70">Press <kbd className="rounded bg-white/10 px-1">⌘K</kbd> for quick actions.</div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar onMenuClick={() => setMobileOpen(!mobileOpen)} />
        <main className="min-w-0 flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {mobileOpen && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} />}
    </div>
  );
}

function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const user = useStore((s) => s.user);
  const theme = useStore((s) => s.theme);
  const notifications = useStore((s) => s.notifications);
  const unread = notifications.filter((n) => !n.read).length;
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const toggleTheme = () => store.set((s) => ({ theme: s.theme === "dark" ? "light" : "dark" }));
  const logout = () => {
    store.set(() => ({ user: null, isAdmin: false }));
    navigate({ to: "/" });
  };
  const markAllRead = () =>
    store.set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) }));

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-border bg-background/80 px-6 backdrop-blur-xl">
      <button className="lg:hidden" onClick={onMenuClick} aria-label="Menu">
        <Search className="h-5 w-5" />
      </button>
      <div className="relative max-w-md flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input placeholder="Search cases, clients, documents..."
          className="h-10 w-full rounded-lg border border-input bg-muted/50 pl-10 pr-3 text-sm focus:bg-background focus:outline-none focus:ring-2 focus:ring-gold" />
      </div>
      <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>
      <div className="relative">
        <Button variant="ghost" size="icon" onClick={() => setNotifOpen(!notifOpen)} aria-label="Notifications">
          <Bell className="h-4 w-4" />
          {unread > 0 && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-gold" />}
        </Button>
        {notifOpen && (
          <div className="absolute right-0 mt-2 w-80 rounded-xl border border-border bg-popover p-2 shadow-elegant">
            <div className="flex items-center justify-between px-3 py-2">
              <div className="font-semibold">Notifications</div>
              <button onClick={markAllRead} className="text-xs text-gold hover:underline">Mark all read</button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.map((n) => (
                <div key={n.id} className={`rounded-lg p-3 ${!n.read ? "bg-muted/50" : ""}`}>
                  <div className="text-sm font-medium">{n.title}</div>
                  <div className="text-xs text-muted-foreground">{n.message}</div>
                  <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">{n.time}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="relative">
        <button onClick={() => setProfileOpen(!profileOpen)}
          className="flex items-center gap-2 rounded-lg p-1 pr-2 hover:bg-accent">
          <div className="grid h-8 w-8 place-items-center rounded-full gradient-gold text-sm font-bold text-gold-foreground">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="hidden text-left md:block">
            <div className="text-sm font-medium leading-tight">{user?.name}</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{user?.role}</div>
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
        {profileOpen && (
          <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-popover p-1 shadow-elegant">
            <div className="border-b border-border px-3 py-2">
              <div className="text-sm font-medium">{user?.name}</div>
              <div className="text-xs text-muted-foreground">{user?.email}</div>
            </div>
            <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-accent">
              <Settings className="h-4 w-4" /> Settings
            </button>
            <button onClick={logout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-accent">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
