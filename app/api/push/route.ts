import { NextResponse } from "next/server";
import webPush from "web-push";
import {
  getVapidEmail,
  getVapidPublicKey,
  getVapidPrivateKey,
} from "@/lib/infrastructure/db/env";

const vapidPublicKey = getVapidPublicKey();
const vapidPrivateKey = getVapidPrivateKey();
const vapidEmail = getVapidEmail();

if (!vapidPublicKey || !vapidPrivateKey || !vapidEmail) {
  throw new Error("VAPID configuration is missing");
}

webPush.setVapidDetails(
  `mailto:${vapidEmail}`,
  vapidPublicKey,
  vapidPrivateKey
);

interface PushPayload {
  title: string;
  body: string;
  url: string;
}

interface WebPushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

interface RequestBody {
  subscription: WebPushSubscription;
  payload: PushPayload;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestBody;
    const { subscription, payload } = body;

    await webPush.sendNotification(subscription, JSON.stringify(payload));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("プッシュ通知送信エラー:", error);
    return NextResponse.json(
      { error: "プッシュ通知の送信に失敗しました" },
      { status: 500 }
    );
  }
}
