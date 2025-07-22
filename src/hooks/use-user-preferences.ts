
"use client";

import { useState, useEffect, useCallback } from "react";
import { getUserPreferences, setUserPreferences } from "@/lib/firestore-preferences";
import { useAuth } from "./use-auth";

export type OperatingSystem = "Windows" | "macOS" | "Linux" | "Not Set";

export function useUserPreferences() {
  const { user } = useAuth();
  const [operatingSystem, setOperatingSystem] = useState<OperatingSystem>("Not Set");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      // Fallback to user agent if no user is logged in
      const userAgent = typeof window !== "undefined" ? window.navigator.userAgent : "";
      if (userAgent.indexOf("Win") != -1) setOperatingSystem("Windows");
      else if (userAgent.indexOf("Mac") != -1) setOperatingSystem("macOS");
      else if (userAgent.indexOf("Linux") != -1) setOperatingSystem("Linux");
      else setOperatingSystem("Not Set");
      return;
    }
    
    setIsLoading(true);
    getUserPreferences(user.uid).then(prefs => {
      if (prefs.operatingSystem) {
        setOperatingSystem(prefs.operatingSystem);
      } else {
        const userAgent = typeof window !== "undefined" ? window.navigator.userAgent : "";
        if (userAgent.indexOf("Win") != -1) setOperatingSystem("Windows");
        else if (userAgent.indexOf("Mac") != -1) setOperatingSystem("macOS");
        else if (userAgent.indexOf("Linux") != -1) setOperatingSystem("Linux");
        else setOperatingSystem("Not Set");
      }
      setIsLoading(false);
    });

  }, [user]);

  const setOS = useCallback(async (os: OperatingSystem) => {
    setOperatingSystem(os);
    if (user) {
      await setUserPreferences(user.uid, { operatingSystem: os });
    }
  }, [user]);

  return { operatingSystem, setOS, isLoading };
}
