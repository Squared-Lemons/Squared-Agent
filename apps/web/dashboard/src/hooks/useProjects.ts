import { useState, useEffect, useCallback } from "react";
import {
  fetchProjects,
  addProject as apiAddProject,
  removeProject as apiRemoveProject,
  type Project,
} from "@/lib/api";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchProjects();
      setProjects(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const addProject = useCallback(async (path: string) => {
    const project = await apiAddProject(path);
    setProjects((prev) => [...prev, project]);
    return project;
  }, []);

  const removeProject = useCallback(async (id: string) => {
    await apiRemoveProject(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return {
    projects,
    loading,
    error,
    addProject,
    removeProject,
    refresh: loadProjects,
  };
}
