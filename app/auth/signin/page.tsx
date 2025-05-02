import { SignInForm } from "@/components/auth/SignInForm";
import Link from "next/link";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
            サインイン
          </h2>
        </div>
        <Suspense fallback={<div>読み込み中...</div>}>
          <SignInForm />
        </Suspense>
        <div className="text-center text-sm">
          <span className="text-gray-600">アカウントをお持ちでない方は</span>{" "}
          <Link
            href="/auth/signup"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            こちら
          </Link>
        </div>
      </div>
    </div>
  );
}
