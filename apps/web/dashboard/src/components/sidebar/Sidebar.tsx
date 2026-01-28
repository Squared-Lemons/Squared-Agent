"use client";

import { useCanvas } from "../canvas";
import { cn } from "@/lib/utils";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  entityType: "sessions-list" | "stats" | "timeline" | "settings";
}

const navItems: NavItem[] = [
  {
    id: "sessions",
    label: "Sessions",
    entityType: "sessions-list",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
        <line x1="16" x2="16" y1="2" y2="6" />
        <line x1="8" x2="8" y1="2" y2="6" />
        <line x1="3" x2="21" y1="10" y2="10" />
      </svg>
    ),
  },
  {
    id: "stats",
    label: "Stats",
    entityType: "stats",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="12" x2="12" y1="20" y2="10" />
        <line x1="18" x2="18" y1="20" y2="4" />
        <line x1="6" x2="6" y1="20" y2="16" />
      </svg>
    ),
  },
  {
    id: "timeline",
    label: "Timeline",
    entityType: "timeline",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M3 9h18" />
        <path d="M9 21V9" />
      </svg>
    ),
  },
  {
    id: "settings",
    label: "Settings",
    entityType: "settings",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
];

export function Sidebar() {
  const { panels, navigateToPanel } = useCanvas();

  // Check which panel type is the "main" view (the last panel, or sessions-list if only that)
  const getActiveView = () => {
    if (panels.length === 1) return panels[0].entityType;
    // Return the last panel's type (the main content)
    return panels[panels.length - 1]?.entityType;
  };

  const activeView = getActiveView();

  const handleNavClick = (item: NavItem) => {
    // Navigate replaces the view with just that panel (+ sessions-list as root)
    navigateToPanel(item.entityType, item.label);
  };

  return (
    <aside className="w-16 bg-background border-r flex flex-col items-center py-4 gap-1">
      {/* Logo/Brand */}
      <div className="mb-4 p-2">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-sm">S</span>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => {
          // Sessions is active when it's the only panel (home view)
          // Other items are active when they're the main view
          const isActive = item.entityType === "sessions-list"
            ? panels.length === 1 && activeView === "sessions-list"
            : activeView === item.entityType;

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              className={cn(
                "w-12 h-12 rounded-lg flex flex-col items-center justify-center gap-0.5",
                "transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
              title={item.label}
            >
              {item.icon}
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom section - could add user menu, etc */}
      <div className="mt-auto">
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
          <span className="text-xs text-muted-foreground">?</span>
        </div>
      </div>
    </aside>
  );
}
