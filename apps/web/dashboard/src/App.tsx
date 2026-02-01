import {
  CanvasProvider,
  CanvasContainer,
  useCanvas,
  EntityPanelSessionsList,
  EntityPanelSession,
  EntityPanelSessionDetail,
  EntityPanelStats,
  EntityPanelTimeline,
  EntityPanelSettings,
} from "./components/canvas";
import { Sidebar } from "./components/sidebar";

interface TokenData {
  date: string;
  type: "subscription" | "api";
  input: number;
  output: number;
  cacheRead: number;
  cacheCreate: number;
  turns: number;
  cost: number;
  summary?: string;
}

interface LogEntry {
  time: string;
  changes: string[];
  insights: string[];
  commits: string[];
}

function DashboardCanvas() {
  const { panels } = useCanvas();

  return (
    <CanvasContainer>
      {panels.map((panel) => {
        switch (panel.entityType) {
          case "sessions-list":
            return <EntityPanelSessionsList key={panel.id} panelId={panel.id} />;

          case "session":
            return panel.entityId ? (
              <EntityPanelSession
                key={panel.id}
                panelId={panel.id}
                date={panel.entityId}
                title={panel.title}
              />
            ) : null;

          case "session-detail":
            return (
              <EntityPanelSessionDetail
                key={panel.id}
                panelId={panel.id}
                entityId={panel.entityId}
                title={panel.title}
                tokenData={panel.data?.tokenData as TokenData | undefined}
                logEntry={panel.data?.logEntry as LogEntry | undefined}
              />
            );

          case "stats":
            return (
              <EntityPanelStats
                key={panel.id}
                panelId={panel.id}
                title={panel.title || "Stats"}
              />
            );

          case "timeline":
            return (
              <EntityPanelTimeline
                key={panel.id}
                panelId={panel.id}
                title={panel.title || "Timeline"}
              />
            );

          case "settings":
            return (
              <EntityPanelSettings
                key={panel.id}
                panelId={panel.id}
                title={panel.title || "Settings"}
              />
            );

          default:
            return null;
        }
      })}
    </CanvasContainer>
  );
}

function DashboardLayout() {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-background overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-hidden pb-16 md:pb-0 min-h-0">
        <DashboardCanvas />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <CanvasProvider>
      <DashboardLayout />
    </CanvasProvider>
  );
}
