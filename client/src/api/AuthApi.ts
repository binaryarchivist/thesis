import client from './axiosClient';

export interface TokenPair {
  access: string;
  refresh: string;
}

export default class AuthApi {
  /** Log in with email/password → returns { access, refresh } */
  static login(email: string, password: string) {
    return client.post<TokenPair>('/auth/login/', { email, password });
  }

  /** Refresh the access token given a refresh token */
  static refresh(refresh: string) {
    return client.post<{ access: string }>('/auth/refresh/', { refresh });
  }
}
