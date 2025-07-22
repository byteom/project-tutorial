
"use client";

import { useState, useEffect, useCallback } from "react";
import type { Project } from "@/lib/types";
import { initialProjects } from "@/lib/initial-data";

const PROJECTS_STORAGE_KEY = "projectforgeai_projects";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedProjects = localStorage.getItem(PROJECTS_STORAGE_KEY);
      if (storedProjects) {
        setProjects(JSON.parse(storedProjects));
      } else {
        setProjects(initialProjects);
      }
    } catch (error) {
      console.error("Failed to load projects from storage", error);
      setProjects(initialProjects);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
      } catch (error) {
        console.error("Failed to save projects to storage", error);
      }
    }
  }, [projects, isLoading]);

  const addProject = useCallback((newProject: Project) => {
    setProjects((prevProjects) => [newProject, ...prevProjects]);
  }, []);

  const updateProject = useCallback((updatedProject: Project) => {
    setProjects((prevProjects) =>
      prevProjects.map((p) => (p.id === updatedProject.id ? updatedProject : p))
    );
  }, []);

  const deleteProject = useCallback((projectId: string) => {
    setProjects((prevProjects) => prevProjects.filter((p) => p.id !== projectId));
  }, []);

  return { projects, addProject, updateProject, deleteProject, isLoading };
}
