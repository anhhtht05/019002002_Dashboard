export interface AuthResponse  {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    user: {
      id: number;
      role: string;
      email: string;
    };
  };
  