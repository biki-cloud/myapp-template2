import "reflect-metadata";
import { getAuthService } from "@/lib/di/server-side-container";
import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";
import { logger } from "@/lib/logger";

const authService = getAuthService();

const signUpSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID();

  try {
    logger.info("サインアップリクエストを受信", {
      requestId,
      path: "/api/auth/signup",
      method: "POST",
    });

    const body = await request.json();
    logger.debug("リクエストボディを受信", {
      requestId,
      email: body.email,
      name: body.name,
    });

    const validatedData = signUpSchema.parse(body);
    logger.debug("バリデーション成功", {
      requestId,
      email: validatedData.email,
      name: validatedData.name,
    });

    const user = await authService.signUp(
      validatedData.email,
      validatedData.password,
      validatedData.name
    );

    if (!user) {
      logger.warn("既存のメールアドレスでのサインアップ試行", {
        requestId,
        email: validatedData.email,
      });
      return NextResponse.json(
        { error: "このメールアドレスは既に使用されています" },
        { status: 400 }
      );
    }

    logger.info("サインアップ成功", {
      requestId,
      userId: user.id,
      email: user.email,
    });

    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn("バリデーションエラー", {
        requestId,
        errors: error.errors,
      });
      return NextResponse.json(
        { error: "入力データが不正です" },
        { status: 400 }
      );
    }

    logger.error("サインアップ処理中に予期せぬエラーが発生", error as Error, {
      requestId,
    });

    return NextResponse.json(
      { error: "アカウントの作成に失敗しました" },
      { status: 500 }
    );
  }
}
