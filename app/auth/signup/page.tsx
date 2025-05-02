import { SignUpForm } from "@/components/auth/SignUpForm";

export const dynamic = "force-dynamic";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
            アカウント作成
          </h2>
        </div>
        <SignUpForm />
      </div>
    </div>
  );
}
