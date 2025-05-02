import "reflect-metadata";
import { container } from "tsyringe";
import type { Database } from "@/lib/infrastructure/db/drizzle";
import type { IAuthServerService } from "@/lib/core/services/interface/auth.service.interface";
import { AuthServerService } from "@/lib/core/services/impl/auth.service.impl";
import { db } from "@/lib/infrastructure/db/drizzle";
import { UserService } from "../core/services/impl/user.service.impl";
import { UserRepository } from "../core/repositories/impl/user.repository.impl";
import { IUserService } from "../core/services/interface/user.service.interface";
import { IUserRepository } from "../core/repositories/interface/user.repository.interface";
import type { IPushSubscriptionRepository } from "@/lib/core/repositories/interface/push-subscription.repository.interface";
import type { INotificationService } from "@/lib/core/services/interface/notification.service.interface";
import { PushSubscriptionRepository } from "@/lib/core/repositories/impl/push-subscription.repository.impl";
import { PushSubscriptionService } from "@/lib/core/services/impl/push-subscription.service.impl";
import { ServerNotificationService } from "@/lib/core/services/impl/server-notification.service.impl";
import { ServerNotificationRepository } from "@/lib/core/repositories/impl/server-notification.repository.impl";
import { NOTIFICATION_TOKENS } from "@/lib/core/constants/notification";
import { INotificationRepository } from "../core/repositories/interface/notification.repository.interface";

let isInitialized = false;

export function initializeContainer() {
  if (isInitialized) return;

  // Register Database
  container.registerInstance<Database>("Database", db);

  container.registerSingleton<IAuthServerService>(
    "AuthServerService",
    AuthServerService
  );

  container.registerSingleton<IUserService>("UserService", UserService);
  container.registerSingleton<IUserRepository>(
    "UserRepository",
    UserRepository
  );

  // プッシュ通知関連の登録
  container.registerSingleton<IPushSubscriptionRepository>(
    NOTIFICATION_TOKENS.PUSH_SUBSCRIPTION_REPOSITORY,
    PushSubscriptionRepository
  );
  container.registerSingleton<PushSubscriptionService>(
    NOTIFICATION_TOKENS.PUSH_SUBSCRIPTION_SERVICE,
    PushSubscriptionService
  );

  // 通知サービスの登録
  container.registerSingleton<INotificationRepository>(
    NOTIFICATION_TOKENS.REPOSITORY,
    ServerNotificationRepository
  );
  container.registerSingleton<INotificationService>(
    NOTIFICATION_TOKENS.SERVICE,
    ServerNotificationService
  );

  isInitialized = true;
}

initializeContainer();

export function getDatabase() {
  return container.resolve<Database>("Database");
}

export function getAuthService() {
  return container.resolve<IAuthServerService>("AuthServerService");
}

export function getUserService() {
  return container.resolve<IUserService>("UserService");
}

export function getUserRepository() {
  return container.resolve<IUserRepository>("UserRepository");
}

export function getNotificationService() {
  return container.resolve<INotificationService>("NotificationService");
}

export function getNotificationRepository() {
  return container.resolve<INotificationRepository>("NotificationRepository");
}

export function getPushSubscriptionService() {
  return container.resolve<PushSubscriptionService>(
    NOTIFICATION_TOKENS.PUSH_SUBSCRIPTION_SERVICE
  );
}
