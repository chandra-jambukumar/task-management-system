export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithPassword extends User {
  passwordHash: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
  name: string;
  avatarUrl?: string;
}

export interface CreateOAuthUserDto {
  email: string;
  name: string;
  avatarUrl?: string;
  provider: string;
  providerId: string;
}

export interface UpdateUserDto {
  name?: string;
  avatarUrl?: string;
}
