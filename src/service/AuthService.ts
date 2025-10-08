import { apiService } from "./ApiService";

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export type AuthResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: {
    id: number;
    role: string;
    email: string;
  };
};

export const authService = {

  register: async (data: RegisterRequest) => {
    const res = await apiService.post("/api/auth/register", data);
    // console.log("Register response:", res);
    // console.log(res.data?.access_token);
    return res;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const res = await apiService.post<AuthResponse>("/api/auth/login", { email, password });
    const accessToken = res.data?.access_token;  
    const refreshToken = res.data?.refresh_token;
  
    if (accessToken) {
      localStorage.setItem("token", accessToken);
    }
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }
    return res.data;
  },

  refreshToken: async (refreshToken: string): Promise<{ access_token: string }> => {
    const res = await apiService.post<{ access_token: string }>("/api/auth/refresh", { refresh_token: refreshToken });
    return res.data;
  },

  me: async () => {
    return apiService.get("/api/auth/me");
  },

};
