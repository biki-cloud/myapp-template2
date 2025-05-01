export interface IAuthServerService {
  signIn(
    email: string,
    password: string
  ): Promise<{ id: string; email: string; name?: string | null } | null>;
  signUp(
    email: string,
    password: string,
    name: string
  ): Promise<{ id: string; email: string; name?: string | null } | null>;
  signOut(): Promise<void>;
  getSession(): Promise<{
    id: string;
    email: string;
    name?: string | null;
  } | null>;
  getCurrentUser(): Promise<{
    id: string;
    email: string;
    name?: string | null;
  } | null>;
  comparePasswords(password: string, hashedPassword: string): Promise<boolean>;
  hashPassword(password: string): Promise<string>;
  // 他のサーバー専用メソッドがあればここに追加
}
