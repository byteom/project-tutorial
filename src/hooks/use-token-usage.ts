
"use client";

import { useState, useEffect, useCallback } from "react";

const TOKEN_USAGE_STORAGE_KEY = "projectforgeai_token_usage_v2";

interface TokenData {
    count: number;
    lastUpdated: number; // Timestamp
}

export function useTokenUsage() {
  const [tokenCount, setTokenCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedTokenData = localStorage.getItem(TOKEN_USAGE_STORAGE_KEY);
      if (storedTokenData) {
        const data: TokenData = JSON.parse(storedTokenData);
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;

        // Reset if it's been more than 24 hours
        if (now - data.lastUpdated > oneDay) {
          setTokenCount(0);
           localStorage.setItem(TOKEN_USAGE_STORAGE_KEY, JSON.stringify({ count: 0, lastUpdated: now }));
        } else {
          setTokenCount(data.count);
        }
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

  const saveTokenCount = useCallback((count: number) => {
      try {
        const data: TokenData = {
            count: count,
            lastUpdated: Date.now(),
        };
        localStorage.setItem(TOKEN_USAGE_STORAGE_KEY, JSON.stringify(data));
      } catch (error) {
        console.error("Failed to save token usage to storage", error);
      }
  }, []);

  const addTokens = useCallback((count: number) => {
    setTokenCount((prevCount) => {
        const newCount = prevCount + count;
        saveTokenCount(newCount);
        return newCount;
    });
  }, [saveTokenCount]);

  const resetTokens = useCallback(() => {
    setTokenCount(0);
    saveTokenCount(0);
  }, [saveTokenCount]);

  return { tokenCount, addTokens, resetTokens, isLoading };
}
