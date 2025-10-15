import { Device } from './Device';

export class DeviceResponse {
  data: Device[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };

  constructor(data: Device[], page: number, limit: number, total: number) {
    this.data = data;
    this.pagination = { page, limit, total };
  }
}
