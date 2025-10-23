import React, { useState } from "react";
import deviceService from "../../service/DeviceService";
import { X } from "lucide-react";
import Label from "../form/Label.tsx";
import Input from "../form/input/InputField.tsx";
import Select from "../form/Select.tsx";
import { DeviceType, ModelType, HardwareType } from "../../enums";
import Loading from "../../loading/Loading.tsx";

interface RegisterDeviceModalProps {
  onClose: () => void;
  onSuccess?: (message: { type: "success" | "error"| "warning" | "info"; title: string; message: string }) => void;
}

const RegisterDeviceModal: React.FC<RegisterDeviceModalProps> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    deviceId: "",
    deviceName: "",
    deviceType: "",
    hardwareVersion: "",
    serialNumber: "",
    macAddress: "",
    manufacturer: "",
    model: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await deviceService.registerDevice(formData);
      onSuccess?.({
        type: "success",
        title: "Add Device",
        message: `${res.message}`,
      });
      onClose();
    } catch (err: any) {
      if (err.response) {
        onSuccess?.({
          type: "error",
          title: "Failed add device",
          message: `Add device failed: ${err.response.data.error?.message || "Server error"}`,
        });
      } else {
        onSuccess?.({
          type: "error",
          title: "Failed add device",
          message: `Network error: ${err.message}`,
        });
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
          Add New Device
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="w-full">
              <Label htmlFor="deviceId" className="text-base font-medium">Device ID</Label>
              <Input
                id="deviceId"
                type="text"
                placeholder="Enter device ID"
                value={formData.deviceId}
                onChange={(e) => handleChange("deviceId", e.target.value)}
                className="h-12 text-base"
              />
            </div>

            <div className="w-full">
              <Label htmlFor="deviceName" className="text-base font-medium">Device Name</Label>
              <Input
                id="deviceName"
                type="text"
                placeholder="Enter device name"
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
                onChange={(value) => handleChange("deviceType", value)}
                className="h-12 text-base"
              />
            </div>

            <div className="w-full">
              <Label className="text-base font-medium">Hardware Version</Label>
              <Select
                options={Object.values(HardwareType).map((v) => ({ label: v, value: v }))}
                placeholder="Select hardware version"
                onChange={(value) => handleChange("hardwareVersion", value)}
                className="h-12 text-base"
              />
            </div>

            <div className="w-full">
              <Label htmlFor="serialNumber" className="text-base font-medium">Serial Number</Label>
              <Input
                id="serialNumber"
                type="text"
                placeholder="Enter serial number"
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
                placeholder="Enter MAC address"
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
                placeholder="Enter manufacturer name"
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
                onChange={(value) => handleChange("model", value)}
                className="h-12 text-base"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-8 w-full rounded-lg bg-blue-600 text-white py-3.5 font-medium text-lg hover:bg-blue-700 active:scale-[0.98] disabled:bg-gray-400 transition-all duration-200 shadow-md"
          >
            Add device
          </button>
        </form>
      </div>
    </div>
    </>
  );
};

export default RegisterDeviceModal;
