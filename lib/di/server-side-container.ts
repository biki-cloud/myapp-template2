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
import type { INotificationRepository } from "@/lib/core/repositories/interface/notification.repository.interface";
import { NotificationRepository } from "@/lib/core/repositories/impl/notification.repository";
import type { INotificationService } from "@/lib/core/services/interface/notification.service.interface";
import { NotificationService } from "@/lib/core/services/impl/notification.service.impl";

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

  container.registerSingleton<INotificationRepository>(
    "NotificationRepository",
    NotificationRepository
  );
  container.registerSingleton<INotificationService>(
    "NotificationService",
    NotificationService
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
