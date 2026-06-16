export interface AuthRequest {
  email: string;
  password?: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface CurrentUserResponse {
  id: string;
  names: string;
  email: string;
  roles: string[];
  permissions: string[];
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyCodeRequest {
  email: string;
  code: string;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
}
