import axiosClient from "./AxiosClient";
import { FirmwareResponse } from "../model";

const firmwareService = {
  getFirmwares: async (page: number, limit: number) => {
    const params = { page, limit };
    const res = await axiosClient.get<FirmwareResponse>("/api/v1/firmware", { params });
    return res.data;
  },
};

export default firmwareService;
