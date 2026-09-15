"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import PageContainer from "@/components/layout/PageContainer";
import Reveal from "@/components/ui/Reveal";
import Spinner from "@/components/ui/Spinner";

import ProjectHeader from "@/components/projects/ProjectHeader";
import ProjectGrid from "@/components/projects/ProjectGrid";
import ProjectEmptyState from "@/components/projects/ProjectEmptyState";
import CreateProjectDialog from "@/components/projects/CreateProjectDialog";
import EditProjectDialog from "@/components/projects/EditProjectDialog";
import DeleteProjectDialog from "@/components/projects/DeleteProjectDialog";

import { getProjects } from "@/services/api";
import type { Project } from "@/types/project";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);
  const [editingProject, setEditingProject] =
    useState<Project | null>(null);
  const [deletingProject, setDeletingProject] =
    useState<Project | null>(null);

  const loadProjects = useCallback(
    async (showSpinner = false) => {
      try {
        if (showSpinner) {
          setRefreshing(true);
        }

        const response = await getProjects(1, 100);

        setProjects(response.data);
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message ||
            "Unable to load projects."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    void loadProjects();
  }, [loadProjects]);

  if (loading) {
    return (
      <PageContainer>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Spinner size="lg" />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Reveal>
        <ProjectHeader
          count={projects.length}
          onCreate={() => setCreateOpen(true)}
        />
      </Reveal>

      {refreshing ? (
        <div className="mt-4 flex items-center gap-2 text-xs text-[rgb(var(--muted))]">
          <Spinner size="sm" />
          Refreshing projects...
        </div>
      ) : null}

      <div className="mt-8">
        {projects.length > 0 ? (
          <Reveal>
            <ProjectGrid
              projects={projects}
              onEdit={setEditingProject}
              onDelete={setDeletingProject}
            />
          </Reveal>
        ) : (
          <Reveal>
            <ProjectEmptyState
              onCreate={() => setCreateOpen(true)}
            />
          </Reveal>
        )}
      </div>

      <CreateProjectDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={() => void loadProjects(true)}
      />

      <EditProjectDialog
        project={editingProject}
        onClose={() => setEditingProject(null)}
        onUpdated={() => void loadProjects(true)}
      />

      <DeleteProjectDialog
        project={deletingProject}
        onClose={() => setDeletingProject(null)}
        onDeleted={() => void loadProjects(true)}
      />
    </PageContainer>
  );
}