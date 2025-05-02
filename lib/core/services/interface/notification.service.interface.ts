import type { NotificationPayload } from "../../domain/notification.domain";

export type NotificationPermission = "granted" | "denied" | "default";

export interface INotificationService {
  checkSupport(): Promise<boolean>;
  requestPermission(): Promise<NotificationPermission>;
  getPermission(): NotificationPermission;
  registerServiceWorker(): Promise<void>;
  subscribe(): Promise<PushSubscription | null>;
  unsubscribe(subscription: PushSubscription): Promise<boolean>;
  sendNotification(
    subscription: PushSubscription,
    payload: NotificationPayload
  ): Promise<boolean>;
  getStoredSubscription(): Promise<PushSubscription | null>;
}
