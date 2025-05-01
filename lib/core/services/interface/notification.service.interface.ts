export interface INotificationService {
  testNotification(): Promise<void>;
  requestPermission(): Promise<NotificationPermission>;
  getPermission(): NotificationPermission;
  registerServiceWorker(): Promise<ServiceWorkerRegistration | undefined>;
  isSupported(): boolean;
}
