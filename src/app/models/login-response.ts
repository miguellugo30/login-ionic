export interface LoginResponse {
  success: boolean;
  token?: string;
  refresh_token?: string; // opcional
  message?: string;
}
