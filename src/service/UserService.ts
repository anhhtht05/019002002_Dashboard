import axiosClient from "./AxiosClient";
import { UserResponse } from "../model/UserResponse";
import { UpdateUserRequest } from "../model";

const userService = {
  getUsers: async (
    page: number,
    limit: number,
    state?: string,
    role?: string,
    search?:string
  ) => {
    const params: any = { page, limit };

    if (state) params.state = state;
    if (role) params.role = role;
    if (search) params.search = search;

    const res = await axiosClient.get<UserResponse>("/api/admin/users", { params });

    return res.data;
  },
  updateUserState: async (id: string, data: UpdateUserRequest) => {
    const res = await axiosClient.put<UserResponse>(`/api/admin/users/${id}`, data);
    return res.data;
  }
};


export default userService;
