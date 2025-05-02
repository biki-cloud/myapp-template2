export interface IAuthClientService {
  signUp(
    name: string,
    email: string,
    password: string
  ): Promise<{ error?: string } | undefined>;
  signIn(
    email: string,
    password: string
  ): Promise<{ error?: string } | undefined>;
  signOut(): Promise<void>;
}
