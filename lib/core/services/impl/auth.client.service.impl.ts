import { signIn, signOut } from "next-auth/react";
import type { IAuthClientService } from "../interface/auth.client.service.interface";
import { injectable } from "tsyringe";

@injectable()
export class AuthClientService implements IAuthClientService {
  async signUp(name: string, email: string, password: string) {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await response.json();
    if (data?.error) return { error: data.error };
    return {};
  }
  async signIn(email: string, password: string) {
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    return res ? { error: res.error ?? undefined } : undefined;
  }
  async signOut() {
    await signOut({ callbackUrl: "/" });
  }
}
