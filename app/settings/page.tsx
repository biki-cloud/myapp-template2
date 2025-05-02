import { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { redirect } from "next/navigation";
import { UserCircle, Bell } from "lucide-react";
import { getServerSession } from "next-auth";
import { logger } from "@/lib/logger";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "設定",
  description: "ユーザー設定を管理します。",
};

// NotificationSettingsPanelを動的にインポート
const NotificationSettingsPanel = dynamic(
  () =>
    import("@/components/settings/NotificationSettingsPanel").then(
      (mod) => mod.NotificationSettingsPanel
    ),
  {
    ssr: false,
    loading: () => (
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
    ),
  }
);

export default async function SettingsPage() {
  const session = await getServerSession();
  logger.info(`settings.tsx session: ${JSON.stringify(session)}`);
  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-orange-50/50 via-white to-orange-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <div className="container max-w-4xl py-12">
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-500/20 dark:to-orange-600/20 p-4 rounded-full">
              <UserCircle className="w-8 h-8 text-orange-600/90 dark:text-orange-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-orange-200 dark:to-orange-400 bg-clip-text text-transparent">
                設定
              </h1>
              <p className="text-muted-foreground">
                アカウント設定とユーザープロフィールを管理します。
              </p>
            </div>
          </div>
          <Separator className="bg-orange-100 dark:bg-orange-500/20" />
          <Card className="border-orange-100 dark:border-orange-500/20 shadow-lg shadow-orange-100/50 dark:shadow-none backdrop-blur-sm bg-white/80 dark:bg-gray-900/80">
            <CardHeader>
              <CardTitle className="text-xl text-orange-600 dark:text-orange-400">
                プロフィール
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                あなたのプロフィール情報を表示・管理します。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <h2>user info</h2>
            </CardContent>
          </Card>
          <Card className="border-orange-100 dark:border-orange-500/20 shadow-lg shadow-orange-100/50 dark:shadow-none backdrop-blur-sm bg-white/80 dark:bg-gray-900/80">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-orange-600/90 dark:text-orange-400" />
                <CardTitle className="text-xl text-orange-600 dark:text-orange-400">
                  通知設定
                </CardTitle>
              </div>
              <CardDescription className="text-muted-foreground">
                プッシュ通知の設定を管理します。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NotificationSettingsPanel />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
