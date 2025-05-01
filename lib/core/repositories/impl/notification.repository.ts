import type { INotificationRepository } from "../interface/notification.repository.interface";

export class NotificationRepository implements INotificationRepository {
  async testNotification(title: string, options?: NotificationOptions) {
    const reg = await navigator.serviceWorker.getRegistration(
      "/service-worker.js"
    );
    if (!reg) throw new Error("Service Worker未登録");
    reg.showNotification(title, options);
  }

  async requestPermission(): Promise<NotificationPermission> {
    return await Notification.requestPermission();
  }

  getPermission(): NotificationPermission {
    return Notification.permission;
  }

  async registerServiceWorker(): Promise<
    ServiceWorkerRegistration | undefined
  > {
    if ("serviceWorker" in navigator) {
      return await navigator.serviceWorker.register("/service-worker.js");
    }
    return undefined;
  }

  isSupported(): boolean {
    return (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      "Notification" in window
    );
  }
}
