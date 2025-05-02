export interface User {
  id: number;
  email: string;
  name: string | null;
  createdAt: Date;
}

export interface CreateUserInput {
  email: string;
  name: string;
  passwordHash: string;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  passwordHash?: string;
}

export interface UserWithPassword extends User {
  passwordHash: string;
}
