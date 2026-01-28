"use client";

import { useEffect, useRef, type ReactNode, useCallback } from "react";
import { useCanvas } from "./canvas-context";
import { cn } from "@/lib/utils";

interface CanvasContainerProps {
  children: ReactNode;
  className?: string;
}

export function CanvasContainer({ children, className }: CanvasContainerProps) {
  const { panels, activePanelId, setActivePanel, registerScrollRef } = useCanvas();
  const containerRef = useRef<HTMLDivElement>(null);

  // Register scroll container with context
  useEffect(() => {
    registerScrollRef(containerRef.current);
    return () => registerScrollRef(null);
  }, [registerScrollRef]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!activePanelId) return;

      const currentIndex = panels.findIndex((p) => p.id === activePanelId);
      if (currentIndex === -1) return;

      let nextIndex: number | null = null;

      switch (e.key) {
        case "ArrowLeft":
          if (currentIndex > 0) {
            nextIndex = currentIndex - 1;
          }
          break;
        case "ArrowRight":
          if (currentIndex < panels.length - 1) {
            nextIndex = currentIndex + 1;
          }
          break;
        case "Home":
          nextIndex = 0;
          break;
        case "End":
          nextIndex = panels.length - 1;
          break;
      }

      if (nextIndex !== null && panels[nextIndex]) {
        e.preventDefault();
        setActivePanel(panels[nextIndex].id);
      }
    },
    [activePanelId, panels, setActivePanel]
  );

  // Attach keyboard listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Only listen when container has focus
    container.addEventListener("keydown", handleKeyDown);
    return () => container.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className={cn(
        "flex h-screen overflow-x-auto overflow-y-hidden",
        "bg-muted/30 p-4 gap-4",
        "focus:outline-none",
        className
      )}
    >
      {children}
    </div>
  );
}
