import axiosClient from "./AxiosClient";
import { FirmwareResponse } from "../model";
import { UploadFirmwareRequest } from "../model/UploadFirmwareRequest";
import { UpdateFirmwareRequest } from "../Model/UpdateFirmwareRequest";

const firmwareService = {
  getFirmwares: async (page: number, limit: number) => {
    const params = { page, limit };
    const res = await axiosClient.get<FirmwareResponse>("/api/v1/firmware", { params });
    return res.data;
  },
  uploadFirmware: async (data: UploadFirmwareRequest) => {
    try {
      const res = await axiosClient.post("/api/v1/firmware/upload", data, {headers: { "Content-Type": "multipart/form-data"},});
      console.log(data);
      return res.data;
    } catch (error) {
      console.error("Error upload firmware:", error);
      throw error;
    }
  },

  updateFirmware: async (id: string, data: UpdateFirmwareRequest) => {
    try {
      const res = await axiosClient.put(`/api/v1/firmware/update/${id}`, data);
      return res.data;
    } catch (error) {
      console.error("Error upload firmware:", error);
      throw error;
    }
  }
};
export default firmwareService;
