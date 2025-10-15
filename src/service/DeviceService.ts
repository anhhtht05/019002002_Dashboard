import axiosClient from "./AxiosClient";
import { DeviceResponse } from "../Model";

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
        console.log('Device: ', res.data)
        return res.data;
    }
};

export default deviceService;
