import { useCallback, useEffect, useState } from "react";
import { getNotificationService } from "@/lib/di/client-side-container";

interface UseNotificationSetupResult {
  isSupported: boolean;
  isLoading: boolean;
  hasError: boolean;
  isGranted: boolean;
  requestPermission: () => Promise<void>;
}

export function useNotificationSetup(): UseNotificationSetupResult {
  const notificationService = getNotificationService();
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isGranted, setIsGranted] = useState(false);
  const isSupported = notificationService.isSupported();

  useEffect(() => {
    if (!isSupported) return;
    setIsGranted(notificationService.getPermission() === "granted");
  }, [isSupported, notificationService]);

  const requestPermission = useCallback(async () => {
    if (!isSupported) return;
    setIsLoading(true);
    setHasError(false);
    try {
      await notificationService.registerServiceWorker();
      const permission = await notificationService.requestPermission();
      setIsGranted(permission === "granted");
    } catch (e) {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [isSupported, notificationService]);

  return { isSupported, isLoading, hasError, isGranted, requestPermission };
}
