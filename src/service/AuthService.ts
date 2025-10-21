import { apiService } from "./ApiService";
import { AuthResponse, RegisterRequest, GetUserResponse } from "../model";

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
  updatePassword: async (oldPassword: string, newPassword: string) => {
    const res = await apiService.put<AuthResponse>("/api/auth/update-password", { oldPassword, newPassword });
    return res.data;
  },

  refreshToken: async (refreshToken: string): Promise<{ access_token: string }> => {
    const res = await apiService.post<{ access_token: string }>("/api/auth/refresh", { refresh_token: refreshToken });
    return res.data;
  },

  me: async (): Promise<GetUserResponse> => {
    const res = await apiService.get<GetUserResponse>("/api/auth/me");
    return res.data;
  },


};
