import axiosClient from "./AxiosClient";
import { UserResponse } from "../Model/UserResponse";
import { UpdateUserRequest } from "../model";

const userService = {
  getUsers: async (
    page: number,
    limit: number,
    state?: string,
    role?: string
  ) => {
    const params: any = { page, limit };

    if (state) params.state = state;
    if (role) params.role = role;

    const res = await axiosClient.get<UserResponse>("/api/admin/users", { params });

    return res.data;
  },
  updateUserState: async (id: string, data: UpdateUserRequest) => {
    const res = await axiosClient.put<UserResponse>(`/api/admin/users/${id}`, data);
    return res.data;
  }
};


export default userService;
