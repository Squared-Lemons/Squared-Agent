"use client";

import { useRef, useState, useCallback, type ReactNode, type MouseEvent } from "react";
import { useCanvas, type DashboardEntityType } from "./canvas-context";
import { cn } from "@/lib/utils";

// Entity type styling configuration
const entityTypeConfig: Record<DashboardEntityType, { label: string; color: string }> = {
  "sessions-list": { label: "Sessions", color: "bg-slate-500" },
  session: { label: "Day", color: "bg-blue-500" },
  "session-detail": { label: "Session", color: "bg-cyan-500" },
  stats: { label: "Stats", color: "bg-emerald-500" },
  timeline: { label: "Timeline", color: "bg-amber-500" },
  settings: { label: "Settings", color: "bg-violet-500" },
};

interface BasePanelProps {
  panelId: string;
  entityType: DashboardEntityType;
  title?: string;
  showClose?: boolean;
  children: ReactNode;
  className?: string;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  resizable?: boolean;
  headerActions?: ReactNode;
}

export function BasePanel({
  panelId,
  entityType,
  title,
  showClose = true,
  children,
  className,
  width: initialWidth = 600,
  minWidth = 320,
  maxWidth = 1200,
  resizable = true,
  headerActions,
}: BasePanelProps) {
  const { activePanelId, setActivePanel, closePanel, getPanelIndex } = useCanvas();
  const panelRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(initialWidth);
  const [isResizing, setIsResizing] = useState(false);

  const isActive = activePanelId === panelId;
  const panelIndex = getPanelIndex(panelId);
  const canClose = showClose && panelIndex > 0; // Cannot close root panel

  const config = entityTypeConfig[entityType];

  // Handle panel click to activate
  const handlePanelClick = useCallback(() => {
    if (!isActive) {
      setActivePanel(panelId);
    }
  }, [isActive, setActivePanel, panelId]);

  // Handle close button click
  const handleClose = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      closePanel(panelId);
    },
    [closePanel, panelId]
  );

  // Handle resize
  const handleResizeStart = useCallback(
    (e: MouseEvent) => {
      if (!resizable) return;
      e.preventDefault();
      setIsResizing(true);

      const startX = e.clientX;
      const startWidth = width;

      const handleMouseMove = (moveEvent: globalThis.MouseEvent) => {
        const delta = moveEvent.clientX - startX;
        const newWidth = Math.max(minWidth, Math.min(maxWidth, startWidth + delta));
        setWidth(newWidth);
      };

      const handleMouseUp = () => {
        setIsResizing(false);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [resizable, width, minWidth, maxWidth]
  );

  return (
    <div
      ref={panelRef}
      data-panel-id={panelId}
      onClick={handlePanelClick}
      className={cn(
        "flex flex-col flex-shrink-0 rounded-lg shadow border bg-background",
        "transition-shadow duration-200",
        isActive && "ring-2 ring-primary ring-offset-2 shadow-lg",
        !isActive && "opacity-90",
        className
      )}
      style={{ width: `${width}px`, minWidth: `${minWidth}px` }}
    >
      {/* Panel Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
        <div className="flex items-center gap-3">
          {/* Entity type badge */}
          <span
            className={cn(
              "px-2 py-0.5 text-xs font-medium rounded text-white",
              config.color
            )}
          >
            {config.label}
          </span>

          {/* Title */}
          {title && (
            <h2 className="font-semibold text-foreground truncate max-w-[300px]">
              {title}
            </h2>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Custom header actions */}
          {headerActions}

          {/* Close button */}
          {canClose && (
            <button
              onClick={handleClose}
              className={cn(
                "p-1.5 rounded-md hover:bg-muted transition-colors",
                "text-muted-foreground hover:text-foreground"
              )}
              title="Close panel"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Panel Content */}
      <div className="flex-1 overflow-auto p-4">{children}</div>

      {/* Resize Handle */}
      {resizable && (
        <div
          onMouseDown={handleResizeStart}
          className={cn(
            "absolute top-0 right-0 w-1 h-full cursor-ew-resize",
            "hover:bg-primary/30 transition-colors",
            isResizing && "bg-primary/50"
          )}
        />
      )}
    </div>
  );
}
