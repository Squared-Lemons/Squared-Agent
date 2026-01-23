import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, Text, Badge } from "@tremor/react";
import { Plus, Trash2, FolderOpen } from "lucide-react";
import { useProjects } from "@/hooks/useProjects";
import { formatDate } from "@/lib/utils";

export function Projects() {
  const { projects, loading, error, addProject, removeProject } = useProjects();
  const [newPath, setNewPath] = useState("");
  const [adding, setAdding] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPath.trim()) return;

    setAdding(true);
    try {
      await addProject(newPath.trim());
      setNewPath("");
      setShowAddForm(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to add project");
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = async (id: string, name: string) => {
    if (!confirm(`Remove "${name}" from dashboard?`)) return;

    try {
      await removeProject(id);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to remove project");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Text>Loading...</Text>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <Text className="text-red-500">{error}</Text>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">
            Manage your tracked projects
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Project
        </button>
      </div>

      {/* Add Project Form */}
      {showAddForm && (
        <Card>
          <form onSubmit={handleAdd} className="flex gap-4">
            <input
              type="text"
              value={newPath}
              onChange={(e) => setNewPath(e.target.value)}
              placeholder="/path/to/your/project"
              className="flex-1 px-3 py-2 border border-input rounded-md bg-background"
              disabled={adding}
            />
            <button
              type="submit"
              disabled={adding || !newPath.trim()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {adding ? "Adding..." : "Add"}
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 border border-input rounded-md hover:bg-accent transition-colors"
            >
              Cancel
            </button>
          </form>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter the absolute path to a project with a .project/ folder
          </p>
        </Card>
      )}

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <Card className="flex flex-col items-center justify-center h-64 gap-4">
          <FolderOpen className="h-12 w-12 text-muted-foreground" />
          <Text>No projects added yet</Text>
          <Text className="text-muted-foreground">
            Click "Add Project" to track a project
          </Text>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <Card key={project.id} className="relative group">
              <button
                onClick={() => handleRemove(project.id, project.name)}
                className="absolute top-3 right-3 p-2 opacity-0 group-hover:opacity-100 hover:bg-red-100 rounded-md transition-all"
                title="Remove project"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </button>

              <Link to={`/projects/${project.id}`} className="block">
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold">{project.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {project.path}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge color="blue">Added {formatDate(project.addedAt)}</Badge>
                  </div>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
