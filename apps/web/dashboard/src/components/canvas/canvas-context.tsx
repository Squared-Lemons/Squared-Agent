"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";

// Dashboard entity types
export type DashboardEntityType =
  | "sessions-list" // Root panel (cannot close)
  | "session" // Session detail by date (shows all sessions for a day)
  | "session-detail" // Single session detail by time
  | "stats" // Overview metrics/charts
  | "timeline" // Activity heatmap
  | "settings"; // Subscription config

export interface PanelState {
  id: string;
  entityType: DashboardEntityType;
  entityId?: string; // For session panels: the date
  title?: string;
  data?: Record<string, unknown>; // Optional data payload for panels
}

export type NavigateCallback = (
  entityType: DashboardEntityType,
  entityId: string,
  title?: string,
  data?: Record<string, unknown>
) => void;

interface CanvasContextValue {
  panels: PanelState[];
  activePanelId: string | null;
  openPanel: (
    entityType: DashboardEntityType,
    entityId?: string,
    fromPanelId?: string,
    title?: string,
    data?: Record<string, unknown>
  ) => void;
  closePanel: (panelId: string) => void;
  closePanelsAfter: (panelId: string) => void;
  setActivePanel: (panelId: string) => void;
  scrollToPanel: (panelId: string) => void;
  registerScrollRef: (ref: HTMLDivElement | null) => void;
  getPanelIndex: (panelId: string) => number;
  getScrollContainer: () => HTMLDivElement | null;
  navigateToPanel: (entityType: DashboardEntityType, title?: string) => void;
}

const CanvasContext = createContext<CanvasContextValue | null>(null);

// Generate unique panel IDs
let panelCounter = 0;
function generatePanelId(): string {
  return `panel-${++panelCounter}-${Date.now()}`;
}

// URL serialization format: sessions-list,session:2026-01-28,stats
function serializePanels(panels: PanelState[]): string {
  return panels
    .map((p) => (p.entityId ? `${p.entityType}:${p.entityId}` : p.entityType))
    .join(",");
}

function deserializePanels(str: string): PanelState[] {
  if (!str) return [];

  return str.split(",").map((segment) => {
    const [entityType, entityId] = segment.split(":");
    return {
      id: generatePanelId(),
      entityType: entityType as DashboardEntityType,
      entityId: entityId || undefined,
    };
  });
}

interface CanvasProviderProps {
  children: ReactNode;
  initialPanels?: PanelState[];
}

export function CanvasProvider({ children, initialPanels }: CanvasProviderProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const isInitialMount = useRef(true);

  // Initialize panels from URL or default
  const [panels, setPanels] = useState<PanelState[]>(() => {
    if (initialPanels) return initialPanels;

    // Check URL for panels param
    const params = new URLSearchParams(window.location.search);
    const panelsParam = params.get("panels");

    if (panelsParam) {
      const parsed = deserializePanels(panelsParam);
      if (parsed.length > 0) return parsed;
    }

    // Default: sessions-list as root panel
    return [
      {
        id: generatePanelId(),
        entityType: "sessions-list" as DashboardEntityType,
      },
    ];
  });

  const [activePanelId, setActivePanelId] = useState<string | null>(
    () => panels[panels.length - 1]?.id || null
  );

  // Sync URL with panel state
  useEffect(() => {
    // Skip initial mount to prevent double URL update
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const serialized = serializePanels(panels);
    const url = new URL(window.location.href);

    // Only set panels param if we have more than just the root panel
    if (panels.length > 1 || panels[0]?.entityType !== "sessions-list") {
      url.searchParams.set("panels", serialized);
    } else {
      url.searchParams.delete("panels");
    }

    window.history.replaceState({}, "", url.toString());
  }, [panels]);

  // Handle browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const panelsParam = params.get("panels");

      if (panelsParam) {
        const parsed = deserializePanels(panelsParam);
        if (parsed.length > 0) {
          setPanels(parsed);
          setActivePanelId(parsed[parsed.length - 1]?.id || null);
          return;
        }
      }

      // Reset to default
      const defaultPanel: PanelState = {
        id: generatePanelId(),
        entityType: "sessions-list",
      };
      setPanels([defaultPanel]);
      setActivePanelId(defaultPanel.id);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const registerScrollRef = useCallback((ref: HTMLDivElement | null) => {
    scrollRef.current = ref;
  }, []);

  const getScrollContainer = useCallback(() => scrollRef.current, []);

  const getPanelIndex = useCallback(
    (panelId: string) => panels.findIndex((p) => p.id === panelId),
    [panels]
  );

  const scrollToPanel = useCallback((panelId: string) => {
    const container = scrollRef.current;
    if (!container) return;

    const panelElement = container.querySelector(`[data-panel-id="${panelId}"]`);
    if (panelElement) {
      panelElement.scrollIntoView({ behavior: "smooth", inline: "start" });
    }
  }, []);

  const setActivePanel = useCallback(
    (panelId: string) => {
      setActivePanelId(panelId);
      scrollToPanel(panelId);
    },
    [scrollToPanel]
  );

  const openPanel = useCallback(
    (
      entityType: DashboardEntityType,
      entityId?: string,
      fromPanelId?: string,
      title?: string,
      data?: Record<string, unknown>
    ) => {
      // Check if this entity is already open (skip for session-detail as each is unique)
      if (entityType !== "session-detail") {
        const existingPanel = panels.find(
          (p) => p.entityType === entityType && p.entityId === entityId
        );

        if (existingPanel) {
          setActivePanel(existingPanel.id);
          return;
        }
      }

      const newPanel: PanelState = {
        id: generatePanelId(),
        entityType,
        entityId,
        title,
        data,
      };

      setPanels((prev) => {
        // If opening from a specific panel, remove all panels after it
        if (fromPanelId) {
          const fromIndex = prev.findIndex((p) => p.id === fromPanelId);
          if (fromIndex !== -1) {
            return [...prev.slice(0, fromIndex + 1), newPanel];
          }
        }
        // Otherwise append to end
        return [...prev, newPanel];
      });

      setActivePanelId(newPanel.id);

      // Scroll to new panel after render
      requestAnimationFrame(() => {
        scrollToPanel(newPanel.id);
      });
    },
    [panels, setActivePanel, scrollToPanel]
  );

  const closePanel = useCallback(
    (panelId: string) => {
      const panelIndex = getPanelIndex(panelId);

      // Cannot close the root panel (index 0)
      if (panelIndex <= 0) return;

      setPanels((prev) => {
        const newPanels = prev.filter((p) => p.id !== panelId);

        // Update active panel if we closed the active one
        if (activePanelId === panelId && newPanels.length > 0) {
          const newActiveIndex = Math.min(panelIndex - 1, newPanels.length - 1);
          setActivePanelId(newPanels[newActiveIndex].id);
        }

        return newPanels;
      });
    },
    [getPanelIndex, activePanelId]
  );

  const closePanelsAfter = useCallback(
    (panelId: string) => {
      const panelIndex = getPanelIndex(panelId);
      if (panelIndex === -1) return;

      setPanels((prev) => prev.slice(0, panelIndex + 1));
      setActivePanelId(panelId);
    },
    [getPanelIndex]
  );

  // Navigate to a single panel type (replaces current view completely)
  const navigateToPanel = useCallback(
    (entityType: DashboardEntityType, title?: string) => {
      const newPanel: PanelState = {
        id: generatePanelId(),
        entityType,
        title,
      };
      setPanels([newPanel]);
      setActivePanelId(newPanel.id);
    },
    []
  );

  return (
    <CanvasContext.Provider
      value={{
        panels,
        activePanelId,
        openPanel,
        closePanel,
        closePanelsAfter,
        setActivePanel,
        scrollToPanel,
        registerScrollRef,
        getPanelIndex,
        getScrollContainer,
        navigateToPanel,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
}

export function useCanvas(): CanvasContextValue {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error("useCanvas must be used within a CanvasProvider");
  }
  return context;
}

export function usePanelNavigation(panelId: string): NavigateCallback {
  const { openPanel } = useCanvas();

  return useCallback(
    (entityType: DashboardEntityType, entityId: string, title?: string, data?: Record<string, unknown>) => {
      openPanel(entityType, entityId, panelId, title, data);
    },
    [openPanel, panelId]
  );
}
