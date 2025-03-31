export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthState {
  error: string | null;
  user: User | null;
  token: string | null;
}

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  type: string;
  role: string;
}

export interface AuthResponse {
  message: string;
  data: {
    user: User;
    token: string;
  };
}
