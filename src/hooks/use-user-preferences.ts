
"use client";

import { useState, useEffect, useCallback } from "react";

const OS_STORAGE_KEY = "projectai_user_os";

export type OperatingSystem = "Windows" | "macOS" | "Linux" | "Not Set";

export function useUserPreferences() {
  const [operatingSystem, setOperatingSystem] = useState<OperatingSystem>("Not Set");

  useEffect(() => {
    const storedOS = localStorage.getItem(OS_STORAGE_KEY) as OperatingSystem | null;
    if (storedOS && ["Windows", "macOS", "Linux"].includes(storedOS)) {
      setOperatingSystem(storedOS);
    } else {
        // Try to infer from user agent, but this is not reliable.
        const userAgent = typeof window !== "undefined" ? window.navigator.userAgent : "";
        if (userAgent.indexOf("Win") != -1) setOperatingSystem("Windows");
        else if (userAgent.indexOf("Mac") != -1) setOperatingSystem("macOS");
        else if (userAgent.indexOf("Linux") != -1) setOperatingSystem("Linux");
        else setOperatingSystem("Not Set");
    }
  }, []);

  const setOS = useCallback((os: OperatingSystem) => {
    localStorage.setItem(OS_STORAGE_KEY, os);
    setOperatingSystem(os);
  }, []);

  return { operatingSystem, setOS };
}
