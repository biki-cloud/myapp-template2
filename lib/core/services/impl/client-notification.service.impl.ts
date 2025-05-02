"use client";

import "reflect-metadata";
import { injectable, inject } from "tsyringe";
import type { NotificationPayload } from "../../domain/notification.domain";
import type {
  INotificationService,
  NotificationPermission,
} from "../interface/notification.service.interface";
import type { INotificationRepository } from "../../repositories/interface/notification.repository.interface";
import { NOTIFICATION_TOKENS } from "@/lib/core/constants/notification";

@injectable()
export class ClientNotificationService implements INotificationService {
  constructor(
    @inject(NOTIFICATION_TOKENS.REPOSITORY)
    private repository: INotificationRepository
  ) {}

  async checkSupport(): Promise<boolean> {
    return this.repository.checkSupport();
  }

  async requestPermission(): Promise<NotificationPermission> {
    const granted = await this.repository.requestPermission();
    return granted ? "granted" : "denied";
  }

  getPermission(): NotificationPermission {
    return Notification.permission;
  }

  async registerServiceWorker(): Promise<void> {
    if ("serviceWorker" in navigator) {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js");
        console.log(
          "Service Worker registered with scope:",
          registration.scope
        );
      } catch (error) {
        console.error("Service Worker registration failed:", error);
        throw error;
      }
    } else {
      throw new Error("Service Worker is not supported in this browser");
    }
  }

  async subscribe(): Promise<PushSubscription | null> {
    const subscription = await this.repository.subscribe();
    if (subscription) {
      this.repository.saveSubscription(subscription);
    }
    return subscription;
  }

  async unsubscribe(subscription: PushSubscription): Promise<boolean> {
    const success = await this.repository.unsubscribe(subscription);
    if (success) {
      this.repository.clearSubscription();
    }
    return success;
  }

  async sendNotification(
    subscription: PushSubscription,
    payload: NotificationPayload
  ): Promise<boolean> {
    return this.repository.sendNotification(subscription, payload);
  }

  async getStoredSubscription(): Promise<PushSubscription | null> {
    return this.repository.getStoredSubscription();
  }
}
