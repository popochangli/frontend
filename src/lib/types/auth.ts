export interface User {
  _id: string;
  name: string;
  email: string;
  tel: string;
  role: 'admin' | 'member';
  createdAt: string;
  updatedAt?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  tel: string;
  role: 'admin' | 'member';
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: RegisterData) => Promise<User>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

