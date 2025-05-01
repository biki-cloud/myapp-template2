export interface INotificationRepository {
  testNotification(title: string, options?: NotificationOptions): Promise<void>;
  requestPermission(): Promise<NotificationPermission>;
  getPermission(): NotificationPermission;
  registerServiceWorker(): Promise<ServiceWorkerRegistration | undefined>;
  isSupported(): boolean;
}
