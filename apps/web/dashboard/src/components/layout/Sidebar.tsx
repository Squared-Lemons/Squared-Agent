import { NavLink } from "react-router-dom";
import { LayoutDashboard, FolderKanban, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Overview" },
  { to: "/projects", icon: FolderKanban, label: "Projects" },
  { to: "/timeline", icon: CalendarDays, label: "Timeline" },
];

export function Sidebar() {
  return (
    <aside className="w-64 border-r border-border bg-card h-screen sticky top-0">
      <div className="p-6">
        <h1 className="text-xl font-bold text-foreground">Squared Agent</h1>
        <p className="text-sm text-muted-foreground">Dashboard</p>
      </div>

      <nav className="px-3">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
