import AxiosClient from "./AxiosClient";

export const apiService = {
  get: <T>(url: string, params?: any) =>
    AxiosClient.get<T>(url, { params }),

  post: <T>(url: string, data?: any) =>
    AxiosClient.post<T>(url, data),

  put: <T>(url: string, data?: any) =>
    AxiosClient.put<T>(url, data),

  delete: <T>(url: string) =>
    AxiosClient.delete<T>(url),
};

export default apiService;