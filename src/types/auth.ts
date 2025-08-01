export interface User {
  id: string;
  name?: string;
  phone?: string;
  email?: string;
  selfieImage: string; // base64 or blob URL
  createdAt: Date;
  isActive: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
  users: User[];
}