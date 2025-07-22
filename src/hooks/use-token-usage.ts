
"use client";

import { useState, useEffect, useCallback } from "react";

const TOKEN_USAGE_STORAGE_KEY = "projectforgeai_token_usage";

export function useTokenUsage() {
  const [tokenCount, setTokenCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedTokenCount = localStorage.getItem(TOKEN_USAGE_STORAGE_KEY);
      if (storedTokenCount) {
        setTokenCount(JSON.parse(storedTokenCount));
      } else {
        setTokenCount(0);
      }
    } catch (error) {
      console.error("Failed to load token usage from storage", error);
      setTokenCount(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(TOKEN_USAGE_STORAGE_KEY, JSON.stringify(tokenCount));
      } catch (error) {
        console.error("Failed to save token usage to storage", error);
      }
    }
  }, [tokenCount, isLoading]);

  const addTokens = useCallback((count: number) => {
    setTokenCount((prevCount) => prevCount + count);
  }, []);

  const resetTokens = useCallback(() => {
    setTokenCount(0);
  }, []);

  return { tokenCount, addTokens, resetTokens, isLoading };
}
