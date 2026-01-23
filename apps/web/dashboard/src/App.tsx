import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { Overview } from "./pages/Overview";
import { Projects } from "./pages/Projects";
import { ProjectDetail } from "./pages/ProjectDetail";
import { Timeline } from "./pages/Timeline";
import { Settings } from "./pages/Settings";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Layout>
  );
}
