"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import type { NotificationPayload } from "@/lib/core/domain/notification.domain";
import {
  savePushSubscription,
  deletePushSubscription,
  getPushSubscription,
} from "@/app/actions/push-subscription";

let notificationService: any = null;

const initializeNotificationService = async () => {
  if (typeof window === "undefined" || notificationService)
    return notificationService;

  try {
    const { getNotificationService } = await import(
      "@/lib/di/client-side-container"
    );
    notificationService = getNotificationService();
  } catch (error) {
    console.error("通知サービスの初期化に失敗しました:", error);
  }

  return notificationService;
};

export function useNotification() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      if (!isMounted) return;

      const service = await initializeNotificationService();
      if (!service) {
        setIsLoading(false);
        return;
      }

      try {
        if (!(await service.checkSupport())) {
          setIsLoading(false);
          return;
        }

        const { success, subscription: serverSubscription } =
          await getPushSubscription();
        if (success && serverSubscription) {
          const registration = await navigator.serviceWorker.ready;
          const browserSubscription =
            await registration.pushManager.getSubscription();

          if (
            browserSubscription &&
            browserSubscription.endpoint === serverSubscription.endpoint
          ) {
            setSubscription(browserSubscription);
            setIsSubscribed(true);
          }
        }
      } catch (error) {
        console.error("通知の初期化中にエラーが発生しました:", error);
      } finally {
        setIsLoading(false);
      }
    };

    void initialize();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubscribe = async () => {
    if (!notificationService) return;

    try {
      setIsLoading(true);

      if (!(await notificationService.checkSupport())) {
        toast.error("このブラウザはプッシュ通知に対応していません");
        return;
      }

      const isPermissionGranted = await notificationService.requestPermission();
      if (!isPermissionGranted) {
        toast.error("通知の許可が必要です");
        return;
      }

      const newSubscription = await notificationService.subscribe();
      if (newSubscription) {
        const { success, error } = await savePushSubscription({
          endpoint: newSubscription.endpoint,
          keys: {
            p256dh: btoa(
              String.fromCharCode(
                ...new Uint8Array(newSubscription.getKey("p256dh")!)
              )
            ),
            auth: btoa(
              String.fromCharCode(
                ...new Uint8Array(newSubscription.getKey("auth")!)
              )
            ),
          },
        });

        if (success) {
          setSubscription(newSubscription);
          setIsSubscribed(true);
          toast.success("プッシュ通知を設定しました", {
            description: "テスト通知を送信できます",
          });
        } else {
          toast.error("通知の設定に失敗しました", {
            description: error,
          });
        }
      }
    } catch (error) {
      console.error("プッシュ通知サブスクリプションエラー:", error);
      toast.error("通知の設定に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    if (!notificationService || !subscription) return;

    try {
      setIsLoading(true);
      const success = await notificationService.unsubscribe(subscription);
      if (success) {
        const { success: deleteSuccess, error } =
          await deletePushSubscription();
        if (deleteSuccess) {
          setSubscription(null);
          setIsSubscribed(false);
          toast.success("通知をオフにしました", {
            description: "プッシュ通知は届かなくなります",
          });
        } else {
          toast.error("通知の解除に失敗しました", {
            description: error,
          });
        }
      }
    } catch (error) {
      console.error("通知解除エラー:", error);
      toast.error("通知の解除に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendNotification = async (payload: NotificationPayload) => {
    if (!notificationService || !subscription) {
      toast.error("通知の設定が必要です");
      return;
    }

    try {
      setIsSending(true);
      const success = await notificationService.sendNotification(
        subscription,
        payload
      );
      if (success) {
        toast.success("通知を送信しました", {
          description: "まもなく通知が届きます",
        });
      }
    } catch (error) {
      console.error("通知送信エラー:", error);
      toast.error("通知の送信に失敗しました");
    } finally {
      setIsSending(false);
    }
  };

  return {
    isSubscribed,
    isLoading,
    isSending,
    handleSubscribe,
    handleUnsubscribe,
    handleSendNotification,
  };
}
