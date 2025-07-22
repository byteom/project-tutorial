
"use client";

import { useState, useEffect, useCallback } from "react";
import type { LearningPath } from "@/lib/types";
import { useAuth } from "@/hooks/use-auth";
import {
  getUserLearningPaths,
  addUserLearningPath,
  updateUserLearningPath,
  deleteUserLearningPath,
} from "@/lib/firestore-learning-paths";

export function useLearningPaths() {
  const { user } = useAuth();
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLearningPaths([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    getUserLearningPaths(user.uid)
      .then((fetched) => {
        setLearningPaths(fetched);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load learning paths from Firestore", error);
        setLearningPaths([]);
        setIsLoading(false);
      });
  }, [user]);

  const addLearningPath = useCallback(
    async (newLearningPath: LearningPath) => {
      if (!user) return;
      await addUserLearningPath(user.uid, newLearningPath);
      setLearningPaths((prev) => [newLearningPath, ...prev]);
    },
    [user]
  );
  
  const updateLearningPath = useCallback(
    async (updatedLearningPath: LearningPath) => {
      if (!user) return;
      await updateUserLearningPath(user.uid, updatedLearningPath);
      setLearningPaths((prev) =>
        prev.map((p) => (p.id === updatedLearningPath.id ? updatedLearningPath : p))
      );
    },
    [user]
  );

  const deleteLearningPath = useCallback(
    async (learningPathId: string) => {
      if (!user) return;
      await deleteUserLearningPath(user.uid, learningPathId);
      setLearningPaths((prev) => prev.filter((p) => p.id !== learningPathId));
    },
    [user]
  );

  return { learningPaths, addLearningPath, updateLearningPath, deleteLearningPath, isLoading };
}
