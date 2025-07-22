
"use client";

import { useState, useEffect, useCallback } from "react";
import type { Project } from "@/lib/types";
import { initialProjects } from "@/lib/initial-data";
import { useAuth } from "@/hooks/use-auth";
import {
  getUserProjects,
  addUserProject,
  updateUserProject,
  deleteUserProject,
} from "@/lib/firestore-projects";

export function useProjects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProjects([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    getUserProjects(user.uid)
      .then((fetched) => {
        setProjects(fetched.length ? fetched : initialProjects);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load projects from Firestore", error);
        setProjects(initialProjects);
        setIsLoading(false);
      });
  }, [user]);

  const addProject = useCallback(
    async (newProject: Project) => {
      if (!user) return;
      await addUserProject(user.uid, newProject);
      setProjects((prev) => [newProject, ...prev]);
    },
    [user]
  );

  const updateProject = useCallback(
    async (updatedProject: Project) => {
      if (!user) return;
      await updateUserProject(user.uid, updatedProject);
      setProjects((prev) =>
        prev.map((p) => (p.id === updatedProject.id ? updatedProject : p))
      );
    },
    [user]
  );

  const deleteProject = useCallback(
    async (projectId: string) => {
      if (!user) return;
      await deleteUserProject(user.uid, projectId);
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
    },
    [user]
  );

  return { projects, addProject, updateProject, deleteProject, isLoading };
}
