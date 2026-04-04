export type UserRole = 'ADMIN' | 'RRHH' | 'LECTOR';

export interface AuthUser {
  email: string;
  name: string;
  role: UserRole;
}

export interface AuthAccount extends AuthUser {
  password: string;
}
