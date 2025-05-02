import { eq } from "drizzle-orm";
import "reflect-metadata";
import { inject, injectable } from "tsyringe";
import type { Database } from "@/lib/infrastructure/db/drizzle";
import { user } from "@/lib/infrastructure/db/schema";
import type { User as DbUser } from "@/lib/infrastructure/db/schema";
import type {
  User,
  CreateUserInput,
  UpdateUserInput,
  UserWithPassword,
} from "@/lib/core/domain/user.domain";
import type { IUserRepository } from "./../interface/user.repository.interface";

@injectable()
export class UserRepository implements IUserRepository {
  constructor(@inject("Database") protected readonly db: Database) {}

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1);
    return result[0] ? this.toDomainUser(result[0]) : null;
  }

  private toDomainUser(dbUser: DbUser): User {
    return {
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      createdAt: dbUser.createdAt,
    };
  }

  async findById(id: number): Promise<User | null> {
    const result = await this.db
      .select()
      .from(user)
      .where(eq(user.id, id))
      .limit(1);
    return result[0] ? this.toDomainUser(result[0]) : null;
  }

  async findAll(): Promise<User[]> {
    const results = await this.db.select().from(user);
    return results.map(this.toDomainUser);
  }

  async create(input: CreateUserInput): Promise<User> {
    const result = await this.db
      .insert(user)
      .values({
        email: input.email,
        name: input.name,
        password: input.passwordHash,
      })
      .returning();
    return this.toDomainUser(result[0]);
  }

  async update(id: number, input: UpdateUserInput): Promise<User> {
    const result = await this.db
      .update(user)
      .set(input)
      .where(eq(user.id, id))
      .returning();
    if (!result[0]) throw new Error("User not found");
    return this.toDomainUser(result[0]);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db
      .delete(user)
      .where(eq(user.id, id))
      .returning();
    return result.length > 0;
  }

  async findByEmailWithPassword(
    email: string
  ): Promise<UserWithPassword | null> {
    const result = await this.db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1);
    if (!result[0]) return null;
    return {
      id: result[0].id,
      email: result[0].email,
      name: result[0].name,
      createdAt: result[0].createdAt,
      passwordHash: result[0].password,
    };
  }
}
