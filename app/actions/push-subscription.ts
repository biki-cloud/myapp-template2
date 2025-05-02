"use server";

import { revalidatePath } from "next/cache";
import { getPushSubscriptionService } from "@/lib/di/server-side-container";
import type { WebPushSubscription } from "@/lib/core/repositories/interface/push-subscription.repository.interface";
import { getServerSession } from "next-auth";
import { logger } from "@/lib/logger";
import { authOptions } from "@/lib/config/auth";

export async function savePushSubscription(subscription: WebPushSubscription) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new Error("認証が必要です");
    }

    logger.info(`session: ${JSON.stringify(session)}`);
    logger.info(`id: ${session.user.id}`);

    if (!session.user?.id || typeof session.user.id !== "string") {
      throw new Error("ユーザーIDが無効です");
    }

    const userId = parseInt(session.user.id, 10);
    if (isNaN(userId)) {
      throw new Error("ユーザーIDの形式が不正です");
    }

    const service = getPushSubscriptionService();
    await service.saveSubscription(userId, subscription);
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("プッシュ通知の購読情報の保存に失敗しました:", error);
    return { success: false, error: "プッシュ通知の設定に失敗しました" };
  }
}

export async function deletePushSubscription() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new Error("認証が必要です");
    }

    if (!session.user?.id || typeof session.user.id !== "string") {
      throw new Error("ユーザーIDが無効です");
    }

    const userId = parseInt(session.user.id, 10);
    if (isNaN(userId)) {
      throw new Error("ユーザーIDの形式が不正です");
    }

    const service = getPushSubscriptionService();
    await service.deleteSubscription(userId);
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("プッシュ通知の購読情報の削除に失敗しました:", error);
    return { success: false, error: "プッシュ通知の解除に失敗しました" };
  }
}

export async function getPushSubscription() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new Error("認証が必要です");
    }

    if (!session.user?.id || typeof session.user.id !== "string") {
      throw new Error("ユーザーIDが無効です");
    }

    const userId = parseInt(session.user.id, 10);
    if (isNaN(userId)) {
      throw new Error("ユーザーIDの形式が不正です");
    }

    const service = getPushSubscriptionService();
    const subscription = await service.getSubscription(userId);
    return { success: true, subscription };
  } catch (error) {
    console.error("プッシュ通知の購読情報の取得に失敗しました:", error);
    return { success: false, error: "プッシュ通知の情報取得に失敗しました" };
  }
}
