import axiosClient from "./AxiosClient";
import { DeviceResponse } from "../model";
import { RegisterDeviceRequest } from "../model";
import { UpdateDeviceRequest } from "../Model/UpdateDeviceRequest";

const deviceService = {
    getDevices: async (
        page: number,
        limit: number,
        device_type?: string,
        hardware?: string, 
        model?:string
      ) => {
        const params: any = { page, limit };
        if (device_type) params.device_type = device_type;
        if (hardware) params.hardware = hardware;
        if (model) params.model = model;

        const res = await axiosClient.get<DeviceResponse>("/api/v1/device", { params });
        return res.data;
    },
    registerDevice: async (data: RegisterDeviceRequest) => {
      try {
        const res = await axiosClient.post("/api/v1/device/register", data);
        return res.data;
      } catch (error) {
        console.error("Error registering device:", error);
        throw error;
      }
    },
    updateDevice: async (data: UpdateDeviceRequest) => {
    try {  
      const res = await axiosClient.put("/api/v1/device/update", data);
      return res.data;
    } catch (error) {
      console.error("Error Updating device:", error);
      throw error;
    }
  },
};

export default deviceService;
