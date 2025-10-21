import React, { useState } from "react";
import deviceService from "../../service/DeviceService";
import { X } from "lucide-react";
import Label from "../form/Label.tsx";
import Input from "../form/input/InputField.tsx";
import Select from "../form/Select.tsx";
import { DeviceType, ModelType, HardwareType } from "../../enums";
import { UpdateDeviceRequest } from "../../model/UpdateDeviceRequest.ts";
import Loading from "../../loading/Loading.tsx";

interface UpdateDeviceModalProps {
  device: UpdateDeviceRequest;
  onClose: () => void;
}

const UpdateDeviceModal: React.FC<UpdateDeviceModalProps> = ({ device, onClose }) => {
  const [formData, setFormData] = useState<UpdateDeviceRequest>({
    deviceId: device.deviceId || "",
    deviceName: device.deviceName || "",
    deviceType: device.deviceType || "",
    hardwareVersion: device.hardwareVersion || "",
    serialNumber: device.serialNumber || "",
    macAddress: device.macAddress || "",
    manufacturer: device.manufacturer || "",
    model: device.model || "",
    status: device.status || "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (key: keyof UpdateDeviceRequest, value: string) => {
    setFormData((prev: UpdateDeviceRequest) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await deviceService.updateDevice(formData);
      // alert("Device updated successfully!");
      onClose();
    } catch (err: any) {
      console.error("Update failed:", err);
      if (err.response) {
        alert(`Update failed: ${err.response.data.error?.message || "Server error"}`);
      } else {
        alert(`Network error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    {loading && <Loading />}
    <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all">
      <div className="relative bg-white dark:bg-dark-800 rounded-2xl shadow-2xl w-[90vw] max-w-5xl p-10 border border-gray-200 dark:border-dark-600 animate-fadeIn">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Title */}
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 text-center mb-8">
          Update Device Information
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="w-full">
              <Label htmlFor="deviceId" className="text-base font-medium">Device ID</Label>
              <Input
                id="deviceId"
                type="text"
                value={formData.deviceId}
                className="h-12 text-base bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div className="w-full">
              <Label htmlFor="deviceName" className="text-base font-medium">Device Name</Label>
              <Input
                id="deviceName"
                type="text"
                value={formData.deviceName}
                onChange={(e) => handleChange("deviceName", e.target.value)}
                className="h-12 text-base"
              />
            </div>

            <div className="w-full">
              <Label className="text-base font-medium">Device Type</Label>
              <Select
                options={Object.values(DeviceType).map((v) => ({ label: v, value: v }))}
                placeholder="Select device type"
                defaultValue={formData.deviceType}
                onChange={(value) => handleChange("deviceType", value)}
                className="h-12 text-base"
              />
            </div>

            <div className="w-full">
              <Label className="text-base font-medium">Hardware Version</Label>
              <Select
                options={Object.values(HardwareType).map((v) => ({ label: v, value: v }))}
                placeholder="Select hardware version"
                defaultValue={formData.hardwareVersion}
                onChange={(value) => handleChange("hardwareVersion", value)}
                className="h-12 text-base"
              />
            </div>

            <div className="w-full">
              <Label htmlFor="serialNumber" className="text-base font-medium">Serial Number</Label>
              <Input
                id="serialNumber"
                type="text"
                value={formData.serialNumber}
                onChange={(e) => handleChange("serialNumber", e.target.value)}
                className="h-12 text-base"
              />
            </div>

            <div className="w-full">
              <Label htmlFor="macAddress" className="text-base font-medium">MAC Address</Label>
              <Input
                id="macAddress"
                type="text"
                value={formData.macAddress}
                onChange={(e) => handleChange("macAddress", e.target.value)}
                className="h-12 text-base"
              />
            </div>

            <div className="w-full">
              <Label htmlFor="manufacturer" className="text-base font-medium">Manufacturer</Label>
              <Input
                id="manufacturer"
                type="text"
                value={formData.manufacturer}
                onChange={(e) => handleChange("manufacturer", e.target.value)}
                className="h-12 text-base"
              />
            </div>

            <div className="w-full">
              <Label className="text-base font-medium">Model</Label>
              <Select
                options={Object.values(ModelType).map((v) => ({ label: v, value: v }))}
                placeholder="Select model"
                defaultValue={formData.model}
                onChange={(value) => handleChange("model", value)}
                className="h-12 text-base"
              />
            </div>

            {/* <div className="w-full">
              <Label className="text-base font-medium">Status</Label>
              <Select
                options={[
                  { label: "ONLINE", value: "ONLINE" },
                  { label: "OFFLINE", value: "OFFLINE" },
                  { label: "DELETED", value: "DELETED" },
                ]}
                defaultValue={formData.status}
                onChange={(value) => handleChange("status", value)}
                className="h-12 text-base"
              />
            </div> */}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-8 w-full rounded-lg bg-blue-600 text-white py-3.5 font-medium text-lg hover:bg-blue-700 active:scale-[0.98] disabled:bg-gray-400 transition-all duration-200 shadow-md"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
    </>
  );
};

export default UpdateDeviceModal;
