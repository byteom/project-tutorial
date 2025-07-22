
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
    const loadProjects = async () => {
        setIsLoading(true);
        try {
            const fetched = await getUserProjects(user.uid);
            // If user has no projects in DB, initialize with default and save them.
            if (fetched.length === 0) {
                setProjects(initialProjects);
                // Save initial projects to user's DB
                for (const project of initialProjects) {
                    await addUserProject(user.uid, project);
                }
            } else {
                setProjects(fetched);
            }
        } catch (error) {
            console.error("Failed to load or initialize projects from Firestore", error);
            setProjects(initialProjects); // Fallback to initial data on error
        } finally {
            setIsLoading(false);
        }
    };
    loadProjects();
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
