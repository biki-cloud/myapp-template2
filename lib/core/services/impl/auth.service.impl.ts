import { injectable, inject } from "tsyringe";
import type { IAuthServerService } from "../interface/auth.service.interface";
import type { Database } from "@/lib/infrastructure/db/drizzle";
import { user } from "@/lib/infrastructure/db/schema";
import { eq } from "drizzle-orm";
import { compare, hash } from "bcryptjs";
import { getServerSession } from "next-auth";

@injectable()
export class AuthServerService implements IAuthServerService {
  constructor(@inject("Database") protected readonly db: Database) {}

  async signIn(email: string, password: string) {
    const get_user = await this.db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .then((rows) => rows[0]);
    if (!get_user) return null;
    const isValid = await this.comparePasswords(password, get_user.password);
    if (!isValid) return null;
    return {
      id: get_user.id.toString(),
      email: get_user.email,
      name: get_user.name,
    };
  }

  async signUp(email: string, password: string, name: string) {
    const exists = await this.db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .then((rows) => rows[0]);
    if (exists) return null;
    const hashedPassword = await this.hashPassword(password);
    const inserted = await this.db
      .insert(user)
      .values({ email, password: hashedPassword, name })
      .returning();
    const inserted_user = inserted[0];
    return {
      id: inserted_user.id.toString(),
      email: inserted_user.email,
      name: inserted_user.name,
    };
  }

  async signOut() {
    // NextAuthのsignOutはクライアント側でのみ動作するため、ここでは何もしない
    return;
  }

  async getSession() {
    const session = await getServerSession();
    if (!session?.user) return null;
    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
    };
  }

  async getCurrentUser() {
    return this.getSession();
  }

  async comparePasswords(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return compare(password, hashedPassword);
  }

  async hashPassword(password: string): Promise<string> {
    return hash(password, 10);
  }
}
