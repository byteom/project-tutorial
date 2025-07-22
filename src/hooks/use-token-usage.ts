
"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import { getUserTokenUsage, setUserTokenUsage } from "@/lib/firestore-token-usage";

export function useTokenUsage() {
  const { user } = useAuth();
  const [tokenCount, setTokenCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setTokenCount(0);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    getUserTokenUsage(user.uid)
      .then((data) => {
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;
        if (now - data.lastUpdated > oneDay) {
          setTokenCount(0);
          setUserTokenUsage(user.uid, { count: 0, lastUpdated: now });
        } else {
          setTokenCount(data.count);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load token usage from Firestore", error);
        setTokenCount(0);
        setIsLoading(false);
      });
  }, [user]);

  const saveTokenCount = useCallback(
    async (count: number) => {
      if (!user) return;
      const data = { count, lastUpdated: Date.now() };
      await setUserTokenUsage(user.uid, data);
    },
    [user]
  );

  const addTokens = useCallback(
    async (count: number) => {
      setTokenCount((prevCount) => {
        const newCount = prevCount + count;
        saveTokenCount(newCount);
        return newCount;
      });
    },
    [saveTokenCount]
  );

  const resetTokens = useCallback(() => {
    setTokenCount(0);
    saveTokenCount(0);
  }, [saveTokenCount]);

  return { tokenCount, addTokens, resetTokens, isLoading };
}
