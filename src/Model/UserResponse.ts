import {User} from './user'
export class UserResponse {
  data: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };

  constructor(data: User[], page: number, limit: number, total: number) {
    this.data = data;
    this.pagination = { page, limit, total };
  }
}
