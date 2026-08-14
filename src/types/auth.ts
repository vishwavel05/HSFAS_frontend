export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe: boolean;
}

export interface AuthUser {
  username: string;
  displayName?: string;
}

/**
 * Shape this app expects back from the configured auth endpoint.
 * The backend README (Backend_final.md) does not document an auth API,
 * so this is the app's own contract — adjust to match your Django
 * auth view's real response if it differs.
 */
export interface LoginResponse {
  token: string;
  user?: AuthUser;
}
