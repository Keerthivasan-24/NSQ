export interface User {
  id: string;
  userId: string;
  name: string;
  role: 'Admin' | 'General User';
  status: string;
  lastLogin: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}
