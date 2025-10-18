import { StatusType } from "../enums";

export interface UpdateUserRequest {
    name?:string;
    email?:string;
    role?: string;
    state?: string;
  }
  