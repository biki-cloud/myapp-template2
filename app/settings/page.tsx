"use client";

import { useSession } from "next-auth/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useNotificationSetup } from "@/components/ui/use-notification-setup";
import { Button } from "@/components/ui/button";
import { useCallback, useState } from "react";
import { getNotificationService } from "@/lib/di/client-side-container";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const { isSupported, isLoading, hasError, isGranted, requestPermission } =
    useNotificationSetup();

  if (status === "loading") return <div className="p-8">Loading...</div>;
  if (!session)
    return <div className="p-8 text-center">ログインが必要です</div>;

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>ユーザ情報の設定</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground">名前</div>
              <div className="text-lg font-medium">
                {session.user.name ?? "-"}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">
                メールアドレス
              </div>
              <div className="text-lg font-medium">{session.user.email}</div>
            </div>
            {/* 通知許可ボタン */}
            {isSupported && (
              <div className="pt-6 space-y-2">
                {isGranted ? (
                  <div className="text-green-600 text-sm">
                    通知は許可されています
                  </div>
                ) : (
                  <Button
                    type="button"
                    onClick={requestPermission}
                    disabled={isLoading}
                    variant="outline"
                    className="w-full"
                  >
                    {isLoading ? "許可中..." : "通知を許可する"}
                  </Button>
                )}
                {hasError && (
                  <div className="text-red-500 text-xs pt-2">
                    通知の許可に失敗しました。ブラウザの設定をご確認ください。
                  </div>
                )}
                {/* テスト通知ボタン */}
                <TestNotificationButton isEnabled={isGranted} />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TestNotificationButton({ isEnabled }: { isEnabled: boolean }) {
  const [isSending, setIsSending] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const notificationService = getNotificationService();

  const handleSend = useCallback(async () => {
    setIsSending(true);
    setHasError(false);
    setIsSent(false);
    try {
      await notificationService.testNotification();
      setIsSent(true);
    } catch (e) {
      setHasError(true);
    } finally {
      setIsSending(false);
    }
  }, [notificationService]);

  return (
    <div className="pt-2">
      <Button
        type="button"
        onClick={handleSend}
        disabled={!isEnabled || isSending}
        variant="default"
        className="w-full"
      >
        {isSending ? "送信中..." : "テスト通知を送信"}
      </Button>
      {isSent && (
        <div className="text-green-600 text-xs pt-1">
          テスト通知を送信しました
        </div>
      )}
      {hasError && (
        <div className="text-red-500 text-xs pt-1">
          通知の送信に失敗しました
        </div>
      )}
    </div>
  );
}
