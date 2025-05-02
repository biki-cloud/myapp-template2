"use client";

import "reflect-metadata";
import { container } from "tsyringe";
import type { INotificationService } from "@/lib/core/services/interface/notification.service.interface";
import { ClientNotificationService } from "@/lib/core/services/impl/client-notification.service.impl";
import type { INotificationRepository } from "@/lib/core/repositories/interface/notification.repository.interface";
import { ClientNotificationRepository } from "@/lib/core/repositories/impl/client-notification.repository.impl";
import type { IAuthClientService } from "@/lib/core/services/interface/auth.client.service.interface";
import { AuthClientService } from "@/lib/core/services/impl/auth.client.service.impl";

let isInitialized = false;

export function initializeContainer() {
  if (isInitialized) return;

  // Register Database
  container.registerSingleton<INotificationRepository>(
    "NotificationRepository",
    ClientNotificationRepository
  );

  container.registerSingleton<INotificationService>(
    "NotificationService",
    ClientNotificationService
  );

  container.registerSingleton<IAuthClientService>(
    "AuthClientService",
    AuthClientService
  );

  isInitialized = true;
}

initializeContainer();

export function getNotificationService() {
  return container.resolve<INotificationService>("NotificationService");
}

export function getAuthClientService() {
  return container.resolve<IAuthClientService>("AuthClientService");
}
