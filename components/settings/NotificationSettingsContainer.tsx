import { Suspense } from "react";
import dynamic from "next/dynamic";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// ローディング状態のプレースホルダー
function LoadingCard() {
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

// 動的にインポートする通知設定パネルのコンテンツ
const NotificationSettingsPanel = dynamic(
  () =>
    import("./NotificationSettingsPanel").then(
      (mod) => mod.NotificationSettingsPanel
    ),
  {
    loading: () => <LoadingCard />,
    ssr: false,
  }
);

export function NotificationSettingsContainer() {
  return (
    <Suspense fallback={<LoadingCard />}>
      <NotificationSettingsPanel />
    </Suspense>
  );
}
