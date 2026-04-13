import { User } from 'src/app/common/user';

export interface AuthResponse {
  token: string;
  user?: Partial<User>;
}

export interface GoogleAuthConfigResponse {
  enabled: boolean;
  clientId: string;
}
