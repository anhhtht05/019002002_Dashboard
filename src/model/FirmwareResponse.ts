import { Firmware } from "./Firmware";

export interface FirmwareResponse {
    data: Firmware[];
    pagination: {
      page: number;
      limit: number;
      total: number;
    };
  }