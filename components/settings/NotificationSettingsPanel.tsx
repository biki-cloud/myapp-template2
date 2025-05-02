"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bell, BellOff, Send } from "lucide-react";
import { useNotification } from "@/components/pwa/hooks/useNotification";
import type { NotificationPayload } from "@/lib/core/domain/notification.domain";

export function NotificationSettingsPanel() {
  const {
    isSubscribed,
    isLoading,
    isSending,
    handleSubscribe,
    handleUnsubscribe,
    handleSendNotification,
  } = useNotification();

  const handleTestNotification = () => {
    if (!handleSendNotification) return;

    const testPayload: NotificationPayload = {
      title: "テスト通知",
      body: "プッシュ通知のテストです",
      url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    };
    handleSendNotification(testPayload);
  };

  if (isLoading) {
    return (
      <Card className="border-orange-100 dark:border-orange-500/20 shadow-lg shadow-orange-100/50 dark:shadow-none backdrop-blur-sm bg-white/80 dark:bg-gray-900/80">
        <CardHeader>
          <CardTitle className="text-xl text-orange-600 dark:text-orange-400">
            プッシュ通知設定
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            ブラウザのプッシュ通知を設定できます
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[52px] flex items-center">
            <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-10 w-32 rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-orange-100 dark:border-orange-500/20 shadow-lg shadow-orange-100/50 dark:shadow-none backdrop-blur-sm bg-white/80 dark:bg-gray-900/80">
      <CardHeader>
        <CardTitle className="text-xl text-orange-600 dark:text-orange-400">
          プッシュ通知設定
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          ブラウザのプッシュ通知を設定できます
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant={isSubscribed ? "outline" : "default"}
            onClick={isSubscribed ? handleUnsubscribe : handleSubscribe}
            disabled={isLoading}
          >
            {isSubscribed ? (
              <>
                <BellOff className="mr-2 h-4 w-4" />
                通知をオフにする
              </>
            ) : (
              <>
                <Bell className="mr-2 h-4 w-4" />
                通知を設定する
              </>
            )}
          </Button>
          {isSubscribed && (
            <Button
              variant="outline"
              onClick={handleTestNotification}
              disabled={isSending || !isSubscribed}
            >
              <Send className="mr-2 h-4 w-4" />
              テスト通知を送信
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
