import "reflect-metadata";
import { injectable, inject } from "tsyringe";
import type { NotificationPayload } from "../../domain/notification.domain";
import type {
  INotificationService,
  NotificationPermission,
} from "../interface/notification.service.interface";
import type { INotificationRepository } from "../../repositories/interface/notification.repository.interface";
import { NOTIFICATION_TOKENS } from "@/lib/core/constants/notification";
import webPush from "web-push";
import type { IPushSubscriptionService } from "../interface/push-subscription.service.interface";

@injectable()
export class ServerNotificationService implements INotificationService {
  private vapidDetails?: {
    subject: string;
    publicKey: string;
    privateKey: string;
  };

  constructor(
    @inject(NOTIFICATION_TOKENS.REPOSITORY)
    private repository: INotificationRepository,
    @inject(NOTIFICATION_TOKENS.PUSH_SUBSCRIPTION_SERVICE)
    private pushSubscriptionService: IPushSubscriptionService
  ) {
    // Web Push通知の設定
    this.initializeVapidDetails();
  }

  private initializeVapidDetails(): void {
    const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    const privateKey = process.env.VAPID_PRIVATE_KEY;
    const contactEmail =
      process.env.NEXT_PUBLIC_CONTACT_EMAIL || "admin@example.com";

    // console.log("🔑 VAPID設定を初期化します", {
    //   hasPublicKey: !!publicKey,
    //   hasPrivateKey: !!privateKey,
    //   contactEmail,
    // });

    if (publicKey && privateKey) {
      this.vapidDetails = {
        subject: `mailto:${contactEmail}`,
        publicKey,
        privateKey,
      };
      webPush.setVapidDetails(
        this.vapidDetails.subject,
        this.vapidDetails.publicKey,
        this.vapidDetails.privateKey
      );
      // console.log("✅ VAPID設定が完了しました");
    } else {
      console.warn("⚠️ VAPID keysが正しく設定されていません");
    }
  }

  async checkSupport(): Promise<boolean> {
    return true;
  }

  async requestPermission(): Promise<NotificationPermission> {
    return "granted";
  }

  getPermission(): NotificationPermission {
    return "granted";
  }

  async registerServiceWorker(): Promise<void> {
    // サーバーサイドでは何もしない
  }

  async subscribe(): Promise<PushSubscription | null> {
    return null;
  }

  async unsubscribe(subscription: PushSubscription): Promise<boolean> {
    return true;
  }

  async sendNotification(
    subscription: PushSubscription,
    payload: NotificationPayload
  ): Promise<boolean> {
    return this.repository.sendNotification(subscription, payload);
  }

  async getStoredSubscription(): Promise<PushSubscription | null> {
    return null;
  }

  // 実際に使用するメソッド
  // async notifyNewProduct(product: Product): Promise<void> {
  //   // console.log("🔔 新商品通知の送信を開始します", {
  //   //   productId: product.id,
  //   //   productName: product.name,
  //   // });

  //   if (!this.vapidDetails) {
  //     console.error("❌ VAPID設定が見つかりません");
  //     return;
  //   }

  //   const subscriptions =
  //     await this.pushSubscriptionService.getAllSubscriptions();
  //   // console.log("📋 購読情報を取得しました", {
  //   //   subscriptionCount: subscriptions.length,
  //   // });

  //   if (!subscriptions.length) {
  //     // console.log("ℹ️ アクティブな購読が見つかりません");
  //     return;
  //   }

  //   const payload = JSON.stringify({
  //     title: "新商品が登録されました！",
  //     body: `${product.name}が新しく追加されました。`,
  //     icon: "/icon-192x192.png",
  //     badge: "/icon-192x192.png",
  //     data: {
  //       url: `/products/${product.id}`,
  //       productId: product.id,
  //     },
  //     actions: [
  //       {
  //         action: "open",
  //         title: "商品を見る",
  //       },
  //     ],
  //   });

  //   // console.log("📤 通知ペイロードを作成しました", { payload });

  //   const errors: Error[] = [];
  //   await Promise.all(
  //     subscriptions.map(async (subscription) => {
  //       try {
  //         // console.log("📨 通知を送信します", {
  //         //   endpoint: subscription.endpoint,
  //         //   userId: subscription.userId,
  //         // });

  //         await webPush.sendNotification(
  //           {
  //             endpoint: subscription.endpoint,
  //             keys: {
  //               p256dh: subscription.p256dh,
  //               auth: subscription.auth,
  //             },
  //           },
  //           payload
  //         );
  //         // console.log("✅ 通知を送信しました", {
  //         //   endpoint: subscription.endpoint,
  //         //   userId: subscription.userId,
  //         // });
  //       } catch (error) {
  //         if (error instanceof Error) {
  //           errors.push(error);
  //           console.error("❌ 通知の送信に失敗しました", {
  //             endpoint: subscription.endpoint,
  //             userId: subscription.userId,
  //             error: error.message,
  //             stack: error.stack,
  //           });
  //           // 購読が無効になっている場合は削除
  //           await this.pushSubscriptionService.deleteSubscription(
  //             subscription.userId
  //           );
  //           console.log("🗑️ 無効な購読を削除しました", {
  //             userId: subscription.userId,
  //           });
  //         }
  //       }
  //     })
  //   );

  //   if (errors.length > 0) {
  //     console.error("❌ 通知送信の最終結果", {
  //       totalSubscriptions: subscriptions.length,
  //       failedCount: errors.length,
  //       successCount: subscriptions.length - errors.length,
  //       errors: errors.map((e) => e.message),
  //     });
  //   } else {
  //     console.log("✅ すべての通知を送信しました", {
  //       totalSubscriptions: subscriptions.length,
  //     });
  //   }
  // }
}
